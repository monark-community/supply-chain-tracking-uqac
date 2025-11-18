import { Router, Request, Response } from "express";
import { q } from "../db";

const router = Router();

// GET /contacts
router.get("/contacts", async (_req: Request, res: Response) => {
  const rows = await q(`SELECT id, name, email, notes FROM contacts ORDER BY id`);
  res.json(rows);
});

// POST /contacts
router.post("/contacts", async (req: Request, res: Response) => {
  const { name, email, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Missing name or email" });
  try {
    // Generate a new contact id like C-###
    const prefix = 'C-';
    const existing = await q(`SELECT id FROM contacts WHERE id LIKE $1`, [prefix + '%']);
    let maxNum = 0;
    for (const r of existing) {
      const parts = (r.id as string).split('-');
      const n = parseInt(parts[1] || '0', 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    const newId = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
    const [created] = await q(
      `INSERT INTO contacts (id, name, email, notes) VALUES ($1,$2,$3,$4) RETURNING id, name, email, notes`,
      [newId, name, email, notes ?? null]
    );
    res.status(201).json(created);
  } catch (err: any) {
    console.error("Error creating contact:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /contacts/:id
router.delete("/contacts/:id", async (req: Request, res: Response) => {
  try {
    const rows = await q(`DELETE FROM contacts WHERE id = $1 RETURNING id, name, email`, [req.params.id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Contact not found" });
    res.json(rows[0]);
  } catch (err: any) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
