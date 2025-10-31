"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProducts, Product } from "@/context/products-context";

interface Transaction {
  uid: string;
  productUid: string;
  country: string;
  province: string;
  actorName: string;
  timestamp: string;
  quantity: string | number;
  unit: string;
  eventType: string;
  actor: string;
  humidity: number;
  temperature: number;
  criticalEvent: boolean;
  transportDocRef: string;
}

export default function DashboardClient() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { products, setProducts } = useProducts();

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [transactionsMap, setTransactionsMap] = useState<Record<string, Transaction[]>>({});
  const [loadingTx, setLoadingTx] = useState<Record<string, boolean>>({});

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products?limit=50&offset=0");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data); // update context
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [setProducts]);

  // Fetch transactions for a product
  const fetchTransactions = async (productId: string) => {
    setLoadingTx((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/transactions`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data: Transaction[] = await res.json();
      setTransactionsMap((prev) => ({ ...prev, [productId]: data }));
    } catch (err) {
      console.error(err);
      setTransactionsMap((prev) => ({ ...prev, [productId]: [] }));
    } finally {
      setLoadingTx((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (isLoading || loadingProducts) return <p className="text-white">Loading...</p>;

  return (
    <section className="container py-10">
      <h2 className="text-3xl font-bold mb-6 text-white">
        {user ? `Welcome, ${user.name}` : "Product Dashboard"}
      </h2>

      {!user ? (
        <div className="text-center mt-10">
          <p className="text-white/80 mb-4">Please log in to view transactions.</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/api/auth/login?returnTo=/dashboard")}
          >
            Log In
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{product.name}</div>
                  <div className="text-sm text-white/70">
                    {product.origin || product.category_name} — {product.certification || product.variety}
                  </div>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => fetchTransactions(product.id)}
                  disabled={loadingTx[product.id]}
                >
                  {loadingTx[product.id] ? "Loading..." : "Transactions"}
                </Button>
              </div>

              {/* Transactions list */}
              {transactionsMap[product.id] && transactionsMap[product.id].length > 0 && (
                <div className="mt-4 bg-gray-700/40 p-3 rounded-md text-white text-sm">
                  {transactionsMap[product.id].map((tx) => (
                    <div key={tx.uid} className="border-b border-gray-600 py-2">
                      <div><strong>Event:</strong> {tx.eventType}</div>
                      <div><strong>Actor:</strong> {tx.actorName} ({tx.actor})</div>
                      <div><strong>Location:</strong> {tx.country}, {tx.province}</div>
                      <div><strong>Quantity:</strong> {tx.quantity} {tx.unit}</div>
                      <div><strong>Timestamp:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</div>
                      <div><strong>Temp:</strong> {tx.temperature}°C, <strong>Humidity:</strong> {tx.humidity}%</div>
                      {tx.transportDocRef && <div><strong>Transport Doc:</strong> {tx.transportDocRef}</div>}
                      {tx.criticalEvent && <div className="text-red-400">Critical Event!</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* No transactions */}
              {transactionsMap[product.id] && transactionsMap[product.id].length === 0 && (
                <div className="mt-2 text-white/70 text-sm">No transactions found.</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
