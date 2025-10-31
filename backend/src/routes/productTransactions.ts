// src/routes/productTransactions.ts
import express from "express";
import { decodeFunctionData } from "viem";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { q } from "../db";

dotenv.config();

const router = express.Router();

// Load contract ABI
const contractPath = path.resolve(
  __dirname,
  "../../../mock-blockchain/artifacts/contracts/SupplyChain.sol/SupplyChain.json"
);
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

// Blockchain RPC endpoint
const RPC_URL = process.env.RPC_URL as string;

// Convert BigInt to string for JSON
function convertBigInts(obj: any): any {
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigInts);
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const [k, v] of Object.entries(obj)) result[k] = convertBigInts(v);
    return result;
  }
  return obj;
}

// Fetch blockchain transaction by hash
async function getTransaction(hash: string) {
  const body = {
    jsonrpc: "2.0",
    method: "eth_getTransactionByHash",
    params: [hash],
    id: 1,
  };

  const res = await fetch(RPC_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return json.result;
}

/**
 * @openapi
 * /api/products/{productId}/transactions:
 *   get:
 *     summary: Get all blockchain transactions for a product
 *     description: Fetches all transactions linked to a product ID and decodes their input data.
 *     tags:
 *       - Product Transactions
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: List of decoded transaction arguments
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 { "uid": "T-001", "productUid": "P-001", "country": "Columbia" }
 *               ]
 *       404:
 *         description: No transactions found for this product
 *       500:
 *         description: Server or decoding error
 */
router.get("/:productId/transactions", async (req, res) => {
  const { productId } = req.params;

  try {
    const rows = await q(
      `SELECT transaction_id FROM product_transactions WHERE product_id = $1`,
      [productId]
    );

    if (!rows.length)
      return res.status(404).json({ error: "No transactions found for this product" });

    const decodedTransactions = [];
    for (const row of rows) {
      const tx = await getTransaction(row.transaction_id);
      if (!tx || !tx.input || tx.input === "0x") continue;

      const decoded = decodeFunctionData({
        abi: contractJson.abi,
        data: tx.input,
      });

      decodedTransactions.push(convertBigInts(decoded.args));
    }
    res.json(decodedTransactions.flat());
  } catch (err: any) {
    console.error("Error fetching product transactions:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
