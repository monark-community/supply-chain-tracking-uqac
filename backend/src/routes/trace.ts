import { Router, Request, Response } from "express";
import { q } from "../db";

const router = Router();

/**
 * @openapi
 * /products/{id}/trace:
 *   get:
 *     summary: Get trace events for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get("/products/:id/trace", async (req: Request, res: Response) => {
  const productId = req.params.id;

  // Vérifier produit
  const [product] = await q(`SELECT id, name FROM product WHERE id = $1`, [productId]);
  if (!product) return res.status(404).json({ error: "Product not found" });

  // Récupérer évènements
  const events = await q(
    `
    SELECT
      t.uid, t.product_id, t.actor_id, a.name AS actor_name,
      t.event_type, t.event_timestamp, t.location_lat, t.location_lon, t.notes,
      bt.blockchain_tx_uid
    FROM trace t
    LEFT JOIN actors a ON a.id = t.actor_id
    LEFT JOIN blockchain_trace bt ON bt.trace_uid = t.uid
    WHERE t.product_id = $1
    ORDER BY t.event_timestamp ASC, t.uid ASC
    `,
    [productId]
  );

  res.json({ product_id: product.id, product_name: product.name, events });
});

/**
 * @openapi
 * /trace:
 *   post:
 *     summary: Create a new trace event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [uid, product_id, actor_id, event_type, event_timestamp]
 *             properties:
 *               uid: { type: string }
 *               product_id: { type: string }
 *               actor_id: { type: string }
 *               event_type: { type: string }
 *               event_timestamp: { type: string, format: date-time }
 *               location_lat: { type: number }
 *               location_lon: { type: number }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
router.post("/trace", async (req: Request, res: Response) => {
  const {
    uid,
    product_id,
    actor_id,
    event_type,
    event_timestamp,
    location_lat,
    location_lon,
    notes,
  } = req.body || {};

  if (!uid || !product_id || !actor_id || !event_type || !event_timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await q(
    `
    INSERT INTO trace
      (uid, product_id, actor_id, event_type, event_timestamp, location_lat, location_lon, notes)
    VALUES
      ($1,  $2,         $3,       $4,         $5,             $6,           $7,           $8)
    `,
    [uid, product_id, actor_id, event_type, event_timestamp, location_lat ?? null, location_lon ?? null, notes ?? null]
  );

  res.status(201).json({ trace_uid: uid });
});

/**
 * @openapi
 * /trace/{uid}/blockchain:
 *   patch:
 *     summary: Attach a blockchain transaction to a trace event
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blockchain_tx_uid]
 *             properties:
 *               blockchain_tx_uid: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.patch("/trace/:uid/blockchain", async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { blockchain_tx_uid } = req.body || {};
  if (!blockchain_tx_uid) return res.status(400).json({ error: "blockchain_tx_uid is required" });

  // upsert simple
  await q(
    `
    INSERT INTO blockchain_trace (trace_uid, blockchain_tx_uid)
    VALUES ($1, $2)
    ON CONFLICT (trace_uid) DO UPDATE SET blockchain_tx_uid = EXCLUDED.blockchain_tx_uid
    `,
    [uid, blockchain_tx_uid]
  );

  res.json({ trace_uid: uid, blockchain_tx_uid });
});

export default router;
