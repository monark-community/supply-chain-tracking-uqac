import { Router, Request, Response } from "express";
import { q } from "../db";

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
