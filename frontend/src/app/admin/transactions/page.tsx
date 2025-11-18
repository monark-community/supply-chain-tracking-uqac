"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const fetchTxs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/product-transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTxs(data);
    } catch (err) {
      console.error(err);
      setTxs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchTxs(); }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Product Transactions</h1>
      <Card className="p-4 bg-gray-800/60 text-white">
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : txs.length ? (
            <div className="space-y-2">
              {txs.map((t: any) => (
                <div key={t.transaction_id} className="flex items-center justify-between bg-gray-700/40 p-2 rounded">
                  <div>{t.transaction_id} — {t.product_id}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/70">No transactions found.</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
