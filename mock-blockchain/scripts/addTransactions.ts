import fs from "fs";
import path from "path";
import hre from "hardhat";
import { ethers } from "ethers";
import { fileURLToPath } from "url";

/**
 * addTransactions.ts
 *
 * Purpose:
 * - Read a local JSON fixture containing an array of transaction objects and
 *   add each one to the on-chain `SupplyChain` contract by calling
 *   `addTransaction(TransactionInput)`.
 *
 * Usage:
 *   npx hardhat run ./scripts/addTransactions.ts --network localhost
 *
 * Environment variables (optional):
 * - RPC_URL: custom JSON-RPC URL (falls back to http://127.0.0.1:8545)
 * - SUPPLYCHAIN_ADDRESS: override the contract address found via Ignition
 * - TRANSACTIONS_FILE: (not implemented) alternative transactions file path
 *
 * Notes:
 * - This script does not rely on hardhat-ethers plugin. Instead it uses the
 *   standalone ethers library and reads compiled artifacts using `hre.artifacts`.
 * - It attempts to find the deployed address in Ignition's output
 *   `ignition/deployments/chain-<chainId>/deployed_addresses.json` using the
 *   key `SupplyChainModule#SupplyChain`. If not found it falls back to the
 *   SUPPLYCHAIN_ADDRESS env var and then to a default hard-coded address.
 */

// __dirname is not defined in ESM modules; recreate it using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  /**
   * Provider selection:
   * - Prefer the active hardhat network config URL when available
   * - Otherwise use RPC_URL env var or default to localhost
   * Using an explicit JsonRpcProvider avoids tight coupling with hardhat plugins
   * and makes the script runnable both against an ephemeral Hardhat network
   * and a persistent local node at http://127.0.0.1:8545.
   */
  const rpcUrl = ((hre as any).network?.config as any)?.url || process.env.RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Signer selection strategy:
  // - If the Hardhat network config (when available) contains private keys,
  //   prefer using the first one and instantiate an ethers.Wallet connected to
  //   our provider.
  // - Otherwise, fall back to provider.getSigner(0) which works for a running
  //   local Hardhat node with unlocked accounts.
  let signer: any;
  const accountsConfig = ((hre as any).network?.config as any)?.accounts;
  if (accountsConfig && Array.isArray(accountsConfig) && accountsConfig.length > 0) {
    // accounts may contain private keys
    signer = new ethers.Wallet(accountsConfig[0], provider);
  } else if (typeof accountsConfig === "object" && accountsConfig.privateKey) {
    signer = new ethers.Wallet(accountsConfig.privateKey, provider);
  } else {
    signer = provider.getSigner(0);
  }

  // Resolve the deployer address for logging. Different signer implementations
  // expose the address in different ways (Wallet.address vs JsonRpcSigner.getAddress()).
  let deployerAddress: string | undefined;
  if ((signer as any).getAddress) {
    try {
      deployerAddress = await (signer as any).getAddress();
    } catch (e) {
      // ignore — we'll try other methods below
    }
  } else if ((signer as any).address) {
    deployerAddress = (signer as any).address;
  }

  // If we still don't have an address, ask the node for available accounts.
  // This covers the case where the provider exposes unlocked accounts but the
  // signer object was not sufficient to extract the address.
  if (!deployerAddress) {
    try {
      const ethAccounts: string[] = await (provider as any).send("eth_accounts", []);
      if (Array.isArray(ethAccounts) && ethAccounts.length > 0) {
        deployerAddress = ethAccounts[0];
        // ensure signer is tied to this address
        try {
          signer = provider.getSigner(deployerAddress);
        } catch (e) {
          // ignore; signer may already be suitable
        }
      }
    } catch (e) {
      // ignore and continue
    }
  }

  console.log("Deploying transactions with account:", deployerAddress);

  // Transactions fixture: a JSON file that must contain an array of objects
  // matching the expected shape for TransactionInput. The file lives at
  // mock-blockchain/data/transactions.json relative to this script.
  const filePath = path.join(__dirname, "../data/transactions.json");
  console.log("Reading transactions file:", filePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Transactions file not found at ${filePath}. Create data/transactions.json or set TRANSACTIONS_FILE.`);
  }
  const rawData = fs.readFileSync(filePath, "utf-8");
  const transactions = JSON.parse(rawData);

  // Read the compiled artifact and construct an ethers.Contract. We avoid
  // relying on hardhat-ethers plugin so this script is portable.
  const artifact = await hre.artifacts.readArtifact("SupplyChain");
  // Try to get the deployed address dynamically from Ignition's deployment
  // outputs (ignition/deployments/chain-<chainId>/deployed_addresses.json).
  // If not available, fall back to an environment variable, then to the
  // previous hard-coded address.
  let supplyChainAddress: string | undefined;

  try {
    const chainId = (await provider.getNetwork()).chainId;
    const deployedPath = path.join(
      __dirname,
      `../ignition/deployments/chain-${chainId}/deployed_addresses.json`
    );
    if (fs.existsSync(deployedPath)) {
      const deployedJson = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
      // The Ignition key format used when deploying in this repo is
      // "SupplyChainModule#SupplyChain" — use that to look up the address.
      supplyChainAddress = deployedJson["SupplyChainModule#SupplyChain"];
    }
  } catch (e) {
    // ignore, will try fallbacks below
  }

  supplyChainAddress =
    supplyChainAddress || process.env.SUPPLYCHAIN_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Some provider implementations may return a thenable for a signer — await
  // it so we always pass a concrete signer instance to contract.connect.
  if (signer && typeof (signer as any).then === "function") {
    signer = await signer;
  }

  // Create a contract instance and attach the signer so calls that send
  // transactions are executed from the selected account. We create the
  // contract with the provider (read-only runner) and then connect a signer
  // for mutable operations.
  const supplyChain = new ethers.Contract(supplyChainAddress, artifact.abi, provider);
  const supplyChainWithSigner = supplyChain.connect(signer as any);

  for (const tx of transactions) {
    // The smart contract expects a single struct (TransactionInput) as its
    // argument. Here we map each JSON entry into an object whose fields match
    // the Solidity struct. Note: timestamps are converted to Unix seconds.
    const txInput = {
      uid: tx.uid,
      productUid: tx.productUid,
      country: tx.country,
      province: tx.province,
      actorName: tx.actorName,
      timestamp: Math.floor(new Date(tx.timestamp).getTime() / 1000), // Unix
      quantity: tx.quantity,
      unit: tx.unit,
      eventType: tx.eventType,
      actor: tx.actor,
      humidity: tx.humidity,
      temperature: tx.temperature,
      criticalEvent: tx.criticalEvent,
      transportDocRef: tx.transportDocRef,
    };

    // Cast to `any` for scripting convenience — in a larger project you may
    // generate TypeScript contract bindings so method signatures are typed.
    const txResponse = await (supplyChainWithSigner as any).addTransaction(txInput);
    await txResponse.wait();
    console.log(`Added transaction ${tx.uid}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
