import { Router, Request, Response } from "express";
import { q } from "../db";

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

export default router;
