import express from "express";
import { decodeFunctionData } from "viem";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

function resolveEnvPath() {
  const repoRoot = path.resolve(__dirname, "../../");
  const envLocal = path.join(repoRoot, ".env.local");
  const envDefault = path.join(repoRoot, ".env");
  const inDocker = !!process.env.DOCKER || fs.existsSync("/.dockerenv");
  if (!inDocker && fs.existsSync(envLocal)) return envLocal;
  return envDefault;
}

dotenv.config({ path: resolveEnvPath() });

const router = express.Router();

// Load contract ABI (used to decode transaction input data)
const contractPath = path.resolve(
  __dirname,
  "../../contracts/SupplyChain.json"
);
const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

// Blockchain RPC endpoint
const RPC_URL = process.env.RPC_URL as string;

/**
 * Convert all BigInts to strings so JSON.stringify doesn't break.
 */
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

/**
 * Fetch a blockchain transaction by its hash using JSON-RPC.
 */
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
 * /api/transaction/{hash}:
 *   get:
 *     summary: Decode blockchain transaction input data
 *     description: Fetches a transaction by hash and decodes its input to return readable arguments.
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: Blockchain transaction hash (0x...)
 *     responses:
 *       200:
 *         description: Successfully decoded transaction arguments
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "uid": "T-001",
 *                   "productUid": "P-001",
 *                   "country": "Columbia"
 *                 }
 *               ]
 *       404:
 *         description: Transaction not found or has no input data
 *       500:
 *         description: Server or decoding error
 */
router.get("/:hash", async (req, res) => {
  try {
    const tx = await getTransaction(req.params.hash);

    if (!tx || !tx.input || tx.input === "0x") {
      return res.status(404).json({ error: "Transaction not found or has no input data" });
    }

    const decoded = decodeFunctionData({
      abi: contractJson.abi,
      data: tx.input,
    });

    const safeDecoded = convertBigInts(decoded);

    //  Return only the decoded args (array of objects)
    res.json(safeDecoded.args);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
