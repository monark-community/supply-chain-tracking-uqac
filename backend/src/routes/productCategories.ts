import { Router, Request, Response } from "express";
import { q } from "../db";

const router = Router();

// GET /product-categories
router.get("/product-categories", async (_req: Request, res: Response) => {
  const rows = await q(`SELECT id, name, description FROM product_categories ORDER BY id`);
  res.json(rows);
});

// POST /product-categories
router.post("/product-categories", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Missing name" });
  try {
    // Generate id like PCAT-###
    const prefix = 'PCAT-';
    const existing = await q(`SELECT id FROM product_categories WHERE id LIKE $1`, [prefix + '%']);
    let maxNum = 0;
    for (const r of existing) {
      const parts = (r.id as string).split('-');
      const n = parseInt(parts[1] || '0', 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    const newId = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
    const [created] = await q(
      `INSERT INTO product_categories (id, name, description) VALUES ($1,$2,$3) RETURNING id, name, description`,
      [newId, name, description ?? null]
    );
    res.status(201).json(created);
  } catch (err: any) {
    console.error("Error creating product category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /product-categories/:id
router.delete("/product-categories/:id", async (req: Request, res: Response) => {
  try {
    const rows = await q(`DELETE FROM product_categories WHERE id = $1 RETURNING id, name`, [req.params.id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Category not found" });
    res.json(rows[0]);
  } catch (err: any) {
    console.error("Error deleting product category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
