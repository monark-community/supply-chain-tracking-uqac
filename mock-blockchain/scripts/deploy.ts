// mock-blockchain/scripts/deploy.ts
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.backend (you can change to .env if needed)
dotenv.config({ path: ".env.backend" });

// --- Environment variables ---
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT!;
const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME!;
const TENDERLY_AUTOMATIC_VERIFICATION =
  process.env.TENDERLY_AUTOMATIC_VERIFICATION === "true";

// --- Create wallet client for signing and deploying transactions ---
const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY as `0x${string}`),
  chain: sepolia,
  transport: http(RPC_URL),
});

(async () => {
  try {
    // --- Load the compiled contract artifact ---
    const contractJson = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../artifacts/contracts/SupplyChain.sol/SupplyChain.json"
        ),
        "utf8"
      )
    );

    // --- Deploy the contract to the blockchain ---
    const deployed = await walletClient.deployContract({
      abi: contractJson.abi,
      bytecode: contractJson.bytecode,
      args: [], // constructor arguments (if any)
    });

    console.log(" Contract deployed at:", deployed);

    // --- Optional: log Tenderly integration info ---
    if (TENDERLY_AUTOMATIC_VERIFICATION) {
      console.log(
        `🔹 Tenderly automatic verification enabled for project "${TENDERLY_PROJECT}" and user "${TENDERLY_USERNAME}".`
      );
      console.log(
        "Once deployed, your contract should appear automatically in your Tenderly dashboard."
      );
    }
  } catch (error) {
    console.error(" Deployment failed:", error);
  }
})();
