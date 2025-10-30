"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductStatus = "Produced" | "In Transit" | "Delivered";

interface Product {
  id: string;
  name: string;
  origin: string;
  certification: string;
  status: ProductStatus;
  location: string;
  time: string;
}

export default function DashboardClient() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // 🔹 Redirection si non connecté
  if (!isLoading && !user) {
    router.push("/api/auth/login?returnTo=/dashboard");
    return null;
  }

  // Exemple produits
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Organic Coffee Beans",
      origin: "Brazil",
      certification: "Fair Trade",
      status: "In Transit",
      location: "Distribution Center A",
      time: "2 hours ago",
    },
    {
      id: "PRD-002",
      name: "Premium Olive Oil",
      origin: "Italy",
      certification: "Organic",
      status: "Delivered",
      location: "Retail Store #42",
      time: "1 day ago",
    },
    {
      id: "PRD-003",
      name: "Artisan Cheese",
      origin: "France",
      certification: "AOP",
      status: "Produced",
      location: "Farm Location",
      time: "3 hours ago",
    },
  ]);

  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [certification, setCertification] = useState("");

  function handleCreateProduct() {
    if (!name || !origin || !certification) return;

    const newProduct: Product = {
      id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
      name,
      origin,
      certification,
      status: "Produced",
      location: origin,
      time: "Just now",
    };

    setProducts((prev) => [newProduct, ...prev]);
    setName("");
    setOrigin("");
    setCertification("");
  }

  function updateProductStatus(id: string, newStatus: ProductStatus) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  }

  const totalProducts = products.length;
  const inTransit = products.filter((p) => p.status === "In Transit").length;
  const delivered = products.filter((p) => p.status === "Delivered").length;
  const qrScans = totalProducts * 5; // mock

  return (
    <section className="container py-10">
      {/* 🔹 Infos utilisateur */}
      {user && (
        <div className="flex items-center gap-4 mb-6">
          {user.picture && (
            <img src={user.picture} alt="Avatar" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-sm text-white/70">{user.email}</div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push("/api/auth/logout")}
          >
            Déconnexion
          </Button>
        </div>
      )}

      {/* Header + ajout produit */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition">
              + Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-white border border-white/10">
            <DialogHeader>
              <DialogTitle>Add a New Product</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Input
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
              <Input
                placeholder="Certification"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
              />
              <Button
                onClick={handleCreateProduct}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              >
                Save Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats + produits récents */}
      {/* ...reste du code inchangé... */}
    </section>
  );
}
