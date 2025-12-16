import { Router, Request, Response } from "express";
import { q } from "../db";

const router = Router();

// GET /actor-categories
router.get("/actor-categories", async (_req: Request, res: Response) => {
  const rows = await q(`SELECT id, name, description FROM actor_categories ORDER BY id`);
  res.json(rows);
});

// POST /actor-categories
router.post("/actor-categories", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Missing name" });
  try {
    // Generate id like ACAT-###
    const prefix = 'ACAT-';
    const existing = await q(`SELECT id FROM actor_categories WHERE id LIKE $1`, [prefix + '%']);
    let maxNum = 0;
    for (const r of existing) {
      const parts = (r.id as string).split('-');
      const n = parseInt(parts[1] || '0', 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    const newId = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
    const [created] = await q(
      `INSERT INTO actor_categories (id, name, description) VALUES ($1,$2,$3) RETURNING id, name, description`,
      [newId, name, description ?? null]
    );
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /actor-categories/:id
router.delete("/actor-categories/:id", async (req: Request, res: Response) => {
  try {
    const rows = await q(`DELETE FROM actor_categories WHERE id = $1 RETURNING id, name`, [req.params.id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Category not found" });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
