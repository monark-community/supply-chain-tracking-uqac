"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts, Product } from "@/context/products-context";
import { API_URL } from "@/lib/env";

// Define the shape of a transaction object
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
  // Get authenticated user info from Auth0
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Access products context
  const { products, setProducts } = useProducts();

  // Local state for loading and transactions
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [transactionsMap, setTransactionsMap] = useState<Record<string, Transaction[]>>({});
  const [loadingTx, setLoadingTx] = useState<Record<string, boolean>>({});
  const [detailsMap, setDetailsMap] = useState<Record<string, Product | null>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [openPanel, setOpenPanel] = useState<Record<string, "transactions" | "details" | undefined>>({});
  const [qtyInputs, setQtyInputs] = useState<Record<string, number | "">>({});
  const [updatingQty, setUpdatingQty] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  type NewProduct = {
    name?: string;
    description?: string;
    category_id?: number | string;
    variety?: string;
    bag_type?: string;
    quantity?: number;
    unit?: string;
    shelf_life_hours?: number;
    notes?: string;
    actors?: number[];
  };

  const [newProduct, setNewProduct] = useState<NewProduct>({});
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=50&offset=0`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data); // Update products in context
      } catch (err) {
        // Silently fail - products will remain empty
      } finally {
        setLoadingProducts(false); // Mark products as loaded
      }
    };
    fetchProducts();
  }, [setProducts]);

  // Fetch transactions for a specific product
  const fetchTransactions = async (productId: string) => {
    setLoadingTx((prev) => ({ ...prev, [productId]: true })); // Mark as loading
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/transactions`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data: Transaction[] = await res.json();
      setTransactionsMap((prev) => ({ ...prev, [productId]: data })); // Save transactions
    } catch (err) {
      setTransactionsMap((prev) => ({ ...prev, [productId]: [] })); // Fallback to empty array
    } finally {
      setLoadingTx((prev) => ({ ...prev, [productId]: false })); // Mark as done loading
    }
  };

  // Toggle transactions panel: open/close and fetch if opening and not loaded
  const toggleTransactions = async (productId: string) => {
    if (openPanel[productId] === "transactions") {
      setOpenPanel((prev) => ({ ...prev, [productId]: undefined }));
      return;
    }

    // Close any other panel for this product and open transactions
    setOpenPanel((prev) => ({ ...prev, [productId]: "transactions" }));

    // Fetch if not already fetched
    if (!transactionsMap[productId] || transactionsMap[productId].length === 0) {
      await fetchTransactions(productId);
    }
  };

  // Fetch product details from backend
  const fetchDetails = async (productId: string) => {
    setLoadingDetails((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await fetch(`${API_URL}/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product details");
      const data: Product = await res.json();
      setDetailsMap((prev) => ({ ...prev, [productId]: data }));
      // initialize qty input to current quantity
      setQtyInputs((prev) => ({ ...prev, [productId]: data.quantity != null ? Number(data.quantity) : "" }));
    } catch (err) {
      setDetailsMap((prev) => ({ ...prev, [productId]: null }));
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Toggle details panel: open/close and fetch if opening and not loaded
  const toggleDetails = async (productId: string) => {
    if (openPanel[productId] === "details") {
      setOpenPanel((prev) => ({ ...prev, [productId]: undefined }));
      return;
    }

    setOpenPanel((prev) => ({ ...prev, [productId]: "details" }));

    if (detailsMap[productId] === undefined) {
      await fetchDetails(productId);
    }
  };

  // Show loading message if user info or products are still loading
  if (isLoading || loadingProducts) return <p className="text-white">Loading...</p>;

  return (
    <section className="container py-10">
      <h2 className="text-3xl font-bold mb-6 text-white">Product Dashboard</h2>

      {/* If user is not logged in */}
      {!user ? (
        <div className="text-center mt-10">
          <p className="text-white/80 mb-4">Please log in to view transactions.</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/api/auth/login?returnTo=/admin")}
          >
            Log In
          </Button>
        </div>
      ) : (
        // If user is logged in, show product list and transaction buttons
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div />
            <div>
              <Button variant="secondary" size="sm" onClick={() => setShowAddForm((s) => !s)}>
                {showAddForm ? "Cancel" : "Add product"}
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card className="p-4 bg-gray-800/60 text-white">
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Name" value={newProduct.name ?? ""} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} />
                  <Input placeholder="Category ID" value={newProduct.category_id ?? ""} onChange={(e) => setNewProduct((p) => ({ ...p, category_id: e.target.value }))} />
                  <Input placeholder="Variety" value={newProduct.variety ?? ""} onChange={(e) => setNewProduct((p) => ({ ...p, variety: e.target.value }))} />
                  <Input placeholder="Quantity" type="number" value={newProduct.quantity ?? ""} onChange={(e) => setNewProduct((p) => ({ ...p, quantity: e.target.value === "" ? undefined : Number(e.target.value) }))} />
                  <Input placeholder="Unit" value={newProduct.unit ?? ""} onChange={(e) => setNewProduct((p) => ({ ...p, unit: e.target.value }))} />
                  <Input
                    placeholder="Actors (comma ids)"
                    value={newProduct.actors ? newProduct.actors.join(",") : ""}
                    onChange={(e) =>
                      setNewProduct((p) => ({
                        ...p,
                        actors: e.target.value
                          ? e.target.value
                              .split(",")
                              .map((s) => Number(s.trim()))
                              .filter((n) => !Number.isNaN(n))
                          : undefined,
                      }))
                    }
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button className="bg-green-600" onClick={async () => {
                    if (!newProduct.name) return;
                    setCreatingProduct(true);
                    try {
                      const body: Record<string, unknown> = {
                        name: newProduct.name,
                        description: newProduct.description ?? null,
                        category_id: newProduct.category_id ?? null,
                        variety: newProduct.variety ?? null,
                        bag_type: newProduct.bag_type ?? null,
                        quantity: newProduct.quantity ?? null,
                        unit: newProduct.unit ?? null,
                        shelf_life_hours: newProduct.shelf_life_hours ?? null,
                        notes: newProduct.notes ?? null,
                      };
                      if (newProduct.actors && newProduct.actors.length) body.actors = newProduct.actors;
                      const res = await fetch(`${API_URL}/products`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                      });
                      if (!res.ok) throw new Error("Failed to create product");
                      const created: Product = await res.json();
                      setProducts((prev) => [created, ...prev]);
                      setShowAddForm(false);
                      setNewProduct({});
                    } catch (err) {
                      // Silently fail
                    } finally {
                      setCreatingProduct(false);
                    }
                  }} disabled={creatingProduct}>{creatingProduct ? "Creating..." : "Create product"}</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {products.map((product) => (
            <Card key={product.id} className="bg-gray-800/60">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-white text-lg">{product.name}</div>
                      <div className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/90">{product.quantity ?? 0} {product.unit ?? ""}</div>
                    </div>
                    <div className="text-sm text-white/70">
                      {product.origin || product.category_name} — {product.certification || product.variety}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => void toggleTransactions(product.id)}
                      disabled={loadingTx[product.id]}
                    >
                      {loadingTx[product.id] ? "Loading..." : openPanel[product.id] === "transactions" ? "Hide Transactions" : "Transactions"}
                    </Button>

                    <Button
                      className="bg-gray-600 hover:bg-gray-700"
                      onClick={() => void toggleDetails(product.id)}
                      disabled={loadingDetails[product.id]}
                    >
                      {loadingDetails[product.id] ? "Loading..." : openPanel[product.id] === "details" ? "Hide Details" : "Details"}
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={async () => {
                        if (!confirm("Supprimer ce produit ?")) return;
                        try {
                          const res = await fetch(`${API_URL}/products/${product.id}`, { method: "DELETE" });
                          if (!res.ok) throw new Error("Failed to delete product");
                          // remove from context
                          setProducts((prev) => prev.filter((p) => p.id !== product.id));
                          // close panels
                          setOpenPanel((prev) => ({ ...prev, [product.id]: undefined }));
                        } catch (err) {
                          // Silently fail
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              {/* Transactions list if selected */}
              {openPanel[product.id] === "transactions" && (
                <div className="mt-4 bg-gray-700/40 p-3 rounded-md text-white text-sm">
                  {transactionsMap[product.id] && transactionsMap[product.id].length > 0 ? (
                    transactionsMap[product.id].map((tx) => (
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
                    ))
                  ) : (
                    <div className="mt-2 text-white/70 text-sm">No transactions found.</div>
                  )}
                </div>
              )}

              {/* Product details if selected */}
              {openPanel[product.id] === "details" && (
                <Card className="mt-4 bg-gray-700/30 text-white text-sm">
                  <CardContent className="p-3">
                    <div className="font-semibold">Details</div>
                    <div className="text-sm mt-2">
                    {detailsMap[product.id] == null ? (
                      <div className="mt-2 text-white/70 text-sm">No details found.</div>
                    ) : (
                      <>
                        <div><strong>Name:</strong> {detailsMap[product.id]!.name}</div>
                        {detailsMap[product.id]!.description && (
                          <div><strong>Description:</strong> {detailsMap[product.id]!.description}</div>
                        )}
                        <div><strong>Category:</strong> {detailsMap[product.id]!.category_name}</div>
                        {detailsMap[product.id]!.variety && (
                          <div><strong>Variety:</strong> {detailsMap[product.id]!.variety}</div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <div><strong>Quantity:</strong></div>
                          <Input
                            type="number"
                            className="w-28"
                            value={qtyInputs[product.id] !== undefined && qtyInputs[product.id] !== "" ? String(qtyInputs[product.id]) : String(detailsMap[product.id]!.quantity ?? "")}
                            onChange={(e) => setQtyInputs((prev) => ({ ...prev, [product.id]: e.target.value === "" ? "" : Number(e.target.value) }))}
                          />
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={async () => {
                              const val = qtyInputs[product.id] !== undefined && qtyInputs[product.id] !== "" ? qtyInputs[product.id] : detailsMap[product.id]!.quantity;
                              if (val === undefined || val === "") return;
                              setUpdatingQty((prev) => ({ ...prev, [product.id]: true }));
                              try {
                                const res = await fetch(`${API_URL}/products/${product.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ quantity: Number(val) }),
                                });
                                if (!res.ok) throw new Error("Failed to update quantity");
                                const updated: Product = await res.json();
                                // Update details and products context
                                setDetailsMap((prev) => ({ ...prev, [product.id]: updated }));
                                setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, quantity: updated.quantity } : p)));
                              } catch (err) {
                                // Silently fail
                              } finally {
                                setUpdatingQty((prev) => ({ ...prev, [product.id]: false }));
                              }
                            }}
                            disabled={updatingQty[product.id]}
                          >
                            {updatingQty[product.id] ? "Updating..." : "Update"}
                          </Button>
                        </div>
                        {detailsMap[product.id]!.shelf_life_hours !== undefined && (
                          <div><strong>Shelf life (hours):</strong> {detailsMap[product.id]!.shelf_life_hours}</div>
                        )}
                        {detailsMap[product.id]!.notes && (
                          <div><strong>Notes:</strong> {detailsMap[product.id]!.notes}</div>
                        )}
                      </>
                    )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Message if no transactions found */}
              {transactionsMap[product.id] && transactionsMap[product.id].length === 0 && (
                <div className="mt-2 text-white/70 text-sm">No transactions found.</div>
              )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
