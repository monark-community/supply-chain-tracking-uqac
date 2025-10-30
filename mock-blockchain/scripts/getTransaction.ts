import fs from "fs";
import path from "path";
import { createPublicClient, http, decodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import contractJson from "../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Read RPC URL, contract address, private key and transaction hash from environment variables
const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const TX_HASH = process.env.TX_HASH!;

// Create a public client to interact with the blockchain
const client = createPublicClient({
  chain: sepolia,           // Target the Sepolia testnet
  transport: http(RPC_URL), // Use HTTP transport with the RPC URL
});

(async () => {
  // Ensure the transaction hash has the correct type
  const txHash = process.env.TX_HASH as `0x${string}`;

  // Fetch the raw transaction from the blockchain
  const tx = await client.getTransaction({ hash: txHash });

  // Check if the transaction exists and contains input data
  if (!tx || !tx.input) {
    console.error("Transaction not found or no data!");
    return;
  }

  // Decode the input data sent to the contract using the contract's ABI
  const decoded = decodeFunctionData({
    abi: contractJson.abi,
    data: tx.input,
  });

  // Check if the decoding was successful and arguments are available
  if (!decoded.args || !decoded.args[0]) {
    console.error("Unable to decode arguments!");
    return;
  }

  // Log the decoded transaction data
  console.log("Decoded data:", decoded.args[0]);
})();
