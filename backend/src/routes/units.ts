import { Router, Request, Response } from "express";
import { q } from "../db";

const router = Router();

// GET /units
router.get("/units", async (_req: Request, res: Response) => {
  const rows = await q(`SELECT unit_code, description FROM units ORDER BY unit_code`);
  res.json(rows);
});

// POST /units
router.post("/units", async (req: Request, res: Response) => {
  const { code, description } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });
  try {
    const [created] = await q(
      `INSERT INTO units (unit_code, description) VALUES ($1,$2) RETURNING unit_code, description`,
      [code, description ?? null]
    );
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /units/:id
router.delete("/units/:code", async (req: Request, res: Response) => {
  try {
    const code = req.params.code;
    const rows = await q(`DELETE FROM units WHERE unit_code = $1 RETURNING unit_code, description`, [code]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Unit not found" });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
