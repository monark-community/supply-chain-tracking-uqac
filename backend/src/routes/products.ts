import { Router, Request, Response } from "express";
import { q, pool } from "../db";

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products (with category & unit)
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: search in name/description
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200: { description: OK }
 */
router.get("/products", async (req: Request, res: Response) => {
  const { q: search = "", limit = "50", offset = "0" } = req.query;
  const params: any[] = [];
  let where = "";
  if (String(search).trim()) {
    params.push(`%${String(search).trim()}%`);
    params.push(`%${String(search).trim()}%`);
    where = `WHERE p.name ILIKE $${params.length - 1} OR p.description ILIKE $${params.length}`;
  }
  params.push(Number(limit), Number(offset));

  const rows = await q(
    `
    SELECT
      p.id, p.name, p.description, p.category_id, pc.name AS category_name,
      p.variety, p.bag_type, p.quantity, p.unit, u.description AS unit_desc,
      p.shelf_life_hours, p.notes
    FROM product p
    LEFT JOIN product_categories pc ON pc.id = p.category_id
    LEFT JOIN units u ON u.unit_code = p.unit
    ${where}
    ORDER BY p.id
    LIMIT $${params.length - 1} OFFSET $${params.length}
    `,
    params
  );

  res.json(rows);
});

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get one product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get("/products/:id", async (req: Request, res: Response) => {
  const [row] = await q(
    `
    SELECT
      p.id, p.name, p.description, p.category_id, pc.name AS category_name,
      p.variety, p.bag_type, p.quantity, p.unit, u.description AS unit_desc,
      p.shelf_life_hours, p.notes
    FROM product p
    LEFT JOIN product_categories pc ON pc.id = p.category_id
    LEFT JOIN units u ON u.unit_code = p.unit
    WHERE p.id = $1
    `,
    [req.params.id]
  );

  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json(row);
});

/**
 * PATCH /products/:id
 * Update product fields (currently supports `quantity`).
 */
router.patch("/products/:id", async (req: Request, res: Response) => {
  const { quantity } = req.body;
  if (quantity === undefined) return res.status(400).json({ error: "Missing quantity in request body" });

  // Ensure quantity is a number (or numeric string)
  const qtyNumber = Number(quantity);
  if (Number.isNaN(qtyNumber)) return res.status(400).json({ error: "Quantity must be a number" });

  try {
    const [updated] = await q(
      `UPDATE product SET quantity = $1 WHERE id = $2 RETURNING id, name, description, category_id, variety, bag_type, quantity, unit, shelf_life_hours, notes`,
      [qtyNumber, req.params.id]
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /products
 * Create a new product and optionally link actors (actor ids array)
 */
router.post("/products", async (req: Request, res: Response) => {
  const {
    name,
    description,
    category_id,
    variety,
    bag_type,
    quantity,
    unit,
    shelf_life_hours,
    notes,
    actors,
  } = req.body;

  if (!name) return res.status(400).json({ error: "Missing product name" });

  try {
    const params: any[] = [name, description ?? null, category_id ?? null, variety ?? null, bag_type ?? null, quantity ?? null, unit ?? null, shelf_life_hours ?? null, notes ?? null];
    const insertSql = `
      INSERT INTO product (name, description, category_id, variety, bag_type, quantity, unit, shelf_life_hours, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, name, description, category_id, variety, bag_type, quantity, unit, shelf_life_hours, notes
    `;

    const [created] = await q(insertSql, params);

    // If actors provided (array of actor ids), insert into actor_products
    if (Array.isArray(actors) && actors.length > 0) {
      const valuesSql = actors.map((_, i) => `($1, $${i + 2})`).join(",");
      const actorParams = [created.id, ...actors];
      await q(`INSERT INTO actor_products (actor_id, product_id) VALUES ${actors.map((_, i) => `($${i + 1}, $${actors.length + 1})`).join(",")}`, [...actors, created.id]);
      // Note: above inserts (actor_id, product_id) for each actor
    }

    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Update product fields (quantity)
 *     description: Update the numeric `quantity` of a product by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request (missing or invalid quantity)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

export default router;

/**
 * DELETE /products/:id
 * Remove a product and its actor relations inside a transaction.
 */
router.delete("/products/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // remove actor relations
    await client.query(`DELETE FROM actor_products WHERE product_id = $1`, [id]);
    // delete product and return deleted row
    const { rows } = await client.query(
      `DELETE FROM product WHERE id = $1 RETURNING id, name, description, category_id, variety, bag_type, quantity, unit, shelf_life_hours, notes`,
      [id]
    );
    if (!rows || rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Product not found" });
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
