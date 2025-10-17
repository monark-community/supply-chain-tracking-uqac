"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Definition of types
type ProductStatus = "Produced" | "In Transit" | "Delivered"

interface Product {
  id: string
  name: string
  origin: string
  certification: string
  status: ProductStatus
  location: string
  time: string
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([
    { id: "PRD-001", name: "Organic Coffee Beans", origin: "Brazil", certification: "Fair Trade", status: "In Transit", location: "Distribution Center A", time: "2 hours ago" },
    { id: "PRD-002", name: "Premium Olive Oil", origin: "Italy", certification: "Organic", status: "Delivered", location: "Retail Store #42", time: "1 day ago" },
    { id: "PRD-003", name: "Artisan Cheese", origin: "France", certification: "AOP", status: "Produced", location: "Farm Location", time: "3 hours ago" },
  ])

  const [name, setName] = useState("")
  const [origin, setOrigin] = useState("")
  const [certification, setCertification] = useState("")

  function handleCreateProduct() {
    if (!name || !origin || !certification) return

    const newProduct: Product = {
      id: `PRD-00${products.length + 1}`,
      name,
      origin,
      certification,
      status: "Produced", //  recognized as ProductStatus
      location: origin,
      time: "Just now",
    }

    setProducts([newProduct, ...products])
    setName("")
    setOrigin("")
    setCertification("")
  }

  function updateProductStatus(id: string, newStatus: ProductStatus) {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, status: newStatus } : p
      )
    )
  }

  //  Dynamic stats
  const totalProducts = products.length
  const inTransit = products.filter((p) => p.status === "In Transit").length
  const delivered = products.filter((p) => p.status === "Delivered").length
  const qrScans = totalProducts * 5 // mock

  return (
    <section className="container py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Producer Dashboard</h2>

        {/* Dialog (popup form) */}
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="bg-card border-white/10 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="text-sm text-white/70">+{totalProducts} registered</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-white/10 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransit}</div>
            <div className="text-sm text-white/70">Active shipments</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-white/10 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delivered}</div>
            <div className="text-sm text-white/70">Successfully completed</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-white/10 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">QR Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrScans}</div>
            <div className="text-sm text-white/70">Consumer verifications</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent products */}
      <h3 className="text-xl font-semibold mb-4">Recent Products</h3>
      <div className="space-y-4">
        {products.map((p) => (
          <Card key={p.id} className="bg-card border-white/10 shadow-md rounded-xl">
            <CardContent className="p-4 flex items-center justify-between">
              {/* Left side */}
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-white/70">ID: {p.id}</div>
                <div className="flex gap-4 text-xs text-white/60 mt-1">
                  <span>{p.time}</span>
                  <span>{p.location}</span>
                </div>
              </div>

              {/* Status + Action */}
              <div className="flex items-center gap-3">
                <Select
                  defaultValue={p.status}
                  onValueChange={(value: ProductStatus) => updateProductStatus(p.id, value)}
                >
                  <SelectTrigger className="w-[130px] bg-gray-800 text-white border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produced">Produced</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="secondary"
                  className="text-xs bg-gray-700 hover:bg-gray-600"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
