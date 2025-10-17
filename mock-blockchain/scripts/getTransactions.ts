import fs from "fs";
import path from "path";
import hre from "hardhat";
import { ethers } from "ethers";
import { fileURLToPath } from "url";

/**
 * getTransactions.ts
 *
 * Purpose:
 * - Connect to the deployed `SupplyChain` contract and read all stored
 *   transactions by calling `getTransactionCount` and `getTransaction(i)`.
 *
 * Usage:
 *   npx hardhat run ./scripts/getTransactions.ts --network localhost
 *
 * Notes:
 * - This script mirrors the dynamic address resolution used in
 *   `addTransactions.ts`: it checks Ignition's deployment output first,
 *   then `SUPPLYCHAIN_ADDRESS` env var, then a fallback address.
 * - Numeric values are coerced to JS numbers for JSON serialization.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rpcUrl = ((hre as any).network?.config as any)?.url || process.env.RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // pick a read-only signer if available; otherwise the provider is enough
  let signer: any = provider.getSigner ? provider.getSigner(0) : undefined;
  // If provider.getSigner returned a promise (some provider implementations do), await it
  if (signer && typeof (signer as any).then === "function") {
    signer = await signer;
  }

  // Locate the deployed address using Ignition outputs, env var, or fallback
  let supplyChainAddress: string | undefined;
  try {
    const chainId = (await provider.getNetwork()).chainId;
    const deployedPath = path.join(__dirname, `../ignition/deployments/chain-${chainId}/deployed_addresses.json`);
    if (fs.existsSync(deployedPath)) {
      const deployedJson = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
      supplyChainAddress = deployedJson["SupplyChainModule#SupplyChain"];
    }
  } catch (e) {
    // ignore
  }
  supplyChainAddress = supplyChainAddress || process.env.SUPPLYCHAIN_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Load the compiled artifact and create a contract instance. We prefer
  // creating the contract with the provider (read-only) and then connecting
  // a signer when needed so the contract runner supports both calls and
  // transactions depending on how the script is executed.
  const artifact = await hre.artifacts.readArtifact("SupplyChain");
  const contract = new ethers.Contract(supplyChainAddress, artifact.abi, provider);
  const contractRunner = signer ? contract.connect(signer) : contract;

  // Get the number of stored transactions and fetch each one. Convert
  // BigNumber-like values to JS numbers for safe JSON serialization.
  const count: number = Number(await (contractRunner as any).getTransactionCount());
  const results: any[] = [];
  for (let i = 0; i < count; i++) {
    const tx = await (contractRunner as any).getTransaction(i);
    // tx is a struct with nested env; convert to plain JS object
    results.push({
      uid: tx.uid,
      productUid: tx.productUid,
      country: tx.country,
      province: tx.province,
      actorName: tx.actorName,
      // timestamps and quantities are numeric and are safe to coerce here
      timestamp: Number(tx.timestamp),
      quantity: Number(tx.quantity),
      unit: tx.unit,
      eventType: tx.eventType,
      actor: tx.actor,
      env: {
        // Convert BigInt/BigNumber-like values to JS numbers (safe for small values)
        humidity: Number(tx.env.humidity),
        temperature: Number(tx.env.temperature),
        criticalEvent: tx.env.criticalEvent,
      },
      transportDocRef: tx.transportDocRef,
    });
  }

  // Print a compact JSON object containing count and transactions for
  // downstream tooling or quick inspection.
  console.log(JSON.stringify({ count, transactions: results }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
