import { Router, Request, Response } from "express";
import { q, pool } from "../db";

const router = Router();

/**
 * @openapi
 * /actors:
 *   get:
 *     summary: List actors (with category & contacts)
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get("/actors", async (req: Request, res: Response) => {
  const { category_id, q: search } = req.query;
  const params: any[] = [];
  const wh: string[] = [];

  if (category_id) { params.push(category_id); wh.push(`a.category_id = $${params.length}`); }
  if (search) {
    params.push(`%${String(search).trim()}%`);
    wh.push(`(a.name ILIKE $${params.length} OR a.description ILIKE $${params.length})`);
  }

  const where = wh.length ? `WHERE ${wh.join(" AND ")}` : "";

  const rows = await q(
    `
    SELECT
      a.id, a.name, a.description, a.category_id, ac.name AS category_name,
      a.lat, a.lon,
      a.fairtrade, a.organic, a.rainforest_alliance, a.bird_friendly,
      a.carbon_neutral, a.direct_trade, a.sca_grade, a.notes
    FROM actors a
    LEFT JOIN actor_categories ac ON ac.id = a.category_id
    ${where}
    ORDER BY a.id
    `,
    params
  );

  res.json(rows);
});

/**
 * @openapi
 * /actors/{id}:
 *   get:
 *     summary: Get one actor with contacts and products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get("/actors/:id", async (req: Request, res: Response) => {
  const [actor] = await q(
    `
    SELECT
      a.id, a.name, a.description, a.category_id, ac.name AS category_name,
      a.lat, a.lon,
      a.fairtrade, a.organic, a.rainforest_alliance, a.bird_friendly,
      a.carbon_neutral, a.direct_trade, a.sca_grade, a.notes
    FROM actors a
    LEFT JOIN actor_categories ac ON ac.id = a.category_id
    WHERE a.id = $1
    `,
    [req.params.id]
  );
  if (!actor) return res.status(404).json({ error: "Actor not found" });

  const contacts = await q(
    `
    SELECT c.id, c.name, c.email, c.notes
    FROM actor_contacts ac
    JOIN contacts c ON c.id = ac.contact_id
    WHERE ac.actor_id = $1
    `,
    [req.params.id]
  );

  const products = await q(
    `
    SELECT p.id, p.name, p.category_id
    FROM actor_products ap
    JOIN product p ON p.id = ap.product_id
    WHERE ap.actor_id = $1
    ORDER BY p.id
    `,
    [req.params.id]
  );

  res.json({ ...actor, contacts, products });
});

export default router;

/**
 * POST /actors
 * Create a simple actor (name required)
 */
router.post("/actors", async (req: Request, res: Response) => {
  const { name, description, category_id } = req.body;
  if (!name) return res.status(400).json({ error: "Missing actor name" });
  try {
    const params: any[] = [name, description ?? null, category_id ?? null];
    const [created] = await q(
      `INSERT INTO actors (name, description, category_id) VALUES ($1,$2,$3) RETURNING id, name, description, category_id`,
      params
    );
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /actors/:id
 * Delete actor and its relations (actor_products, actor_contacts)
 */
router.delete("/actors/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // remove relations
    await client.query(`DELETE FROM actor_products WHERE actor_id = $1`, [id]);
    await client.query(`DELETE FROM actor_contacts WHERE actor_id = $1`, [id]);
    // delete actor
    const { rows } = await client.query(`DELETE FROM actors WHERE id = $1 RETURNING id, name, description, category_id`, [id]);
    if (!rows || rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Actor not found" });
    }
    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});
