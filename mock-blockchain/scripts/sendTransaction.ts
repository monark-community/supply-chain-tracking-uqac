import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Read RPC URL, contract address, private key from environment variables
const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

// ----------------------------
// Create Client WALLET
// ----------------------------
const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY as `0x${string}`),
  chain: sepolia,
  transport: http(RPC_URL),
});

// ----------------------------
// CHARGER ABI DU CONTRAT
// ----------------------------
const contractJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/SupplyChain.sol/SupplyChain.json"),
    "utf8"
  )
);

// ----------------------------
// LIRE LE JSON
// ----------------------------
const filePath = path.join(__dirname, "../data/event.json");
const transactionData = JSON.parse(fs.readFileSync(filePath, "utf8"));

// ----------------------------
// ENVOI DE L'EVENT
// ----------------------------
(async () => {
  try {
    const txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: contractJson.abi,
      functionName: "addTransaction", // nom exact de la fonction Solidity
      args: [
        {
          uid: transactionData.uid,
          productUid: transactionData.productUid,
          country: transactionData.country,
          province: transactionData.province,
          actorName: transactionData.actorName,
          timestamp: transactionData.timestamp,
          quantity: transactionData.quantity,
          unit: transactionData.unit,
          eventType: transactionData.eventType,
          actor: transactionData.actor,
          humidity: transactionData.humidity,
          temperature: transactionData.temperature,
          criticalEvent: transactionData.criticalEvent,
          transportDocRef: transactionData.transportDocRef,
        }
      ],
    });

    console.log("✅ Transaction envoyée :", txHash);
  } catch (e) {
    console.error("❌ Erreur :", e);
  }
})();
