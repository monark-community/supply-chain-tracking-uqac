
import { Router } from "express";
const router = Router();

router.get("/products/:id/trace", (req, res) => {
  res.json({ product_id: req.params.id, events: [] });
});

router.post("/trace", (req, res) => {
  res.status(201).json({ trace_uid: req.body?.trace_uid ?? "T-NEW" });
});

router.patch("/trace/:uid/blockchain", (req, res) => {
  res.json({ trace_uid: req.params.uid, blockchain_tx_uid: req.body?.blockchain_tx_uid ?? null });
});

export default router;
