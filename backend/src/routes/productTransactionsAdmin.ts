import { Router, Request, Response } from "express";
import { q } from "../db";

const router = Router();

// GET /product-transactions
router.get("/product-transactions", async (_req: Request, res: Response) => {
  const rows = await q(`SELECT transaction_id, product_id FROM product_transactions ORDER BY transaction_id DESC`);
  res.json(rows);
});

export default router;
