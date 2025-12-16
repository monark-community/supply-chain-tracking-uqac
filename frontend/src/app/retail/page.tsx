"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// RetailPage component for confirming product deliveries
export default function RetailPage() {
  // State for input fields
  const [productId, setProductId] = useState("") // Product ID input
  const [quality, setQuality] = useState("") // Quality check input
  const [deliveries, setDeliveries] = useState<any[]>([]) // List of confirmed deliveries

  // Handle confirming a delivery
  function handleDelivery() {
    if (!productId || !quality) return // Do nothing if fields are empty

    const delivery = {
      id: deliveries.length + 1, // Unique ID for each delivery
      productId,
      quality,
      status: "Delivered", // Set default status
    }

    setDeliveries([...deliveries, delivery]) // Add new delivery to the list
    setProductId("") // Clear input
    setQuality("") // Clear input
  }

  return (
    <section className="container py-12">
      {/* Page heading */}
      <h2 className="text-3xl font-bold mb-8">Retail Admin</h2>

      {/* Form to confirm delivery */}
      <Card className="max-w-lg mb-10">
        <CardHeader>
          <CardTitle>Confirm Delivery</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)} // Update state
          />
          <Input
            placeholder="Quality Check (e.g. Good / Damaged)"
            value={quality}
            onChange={(e) => setQuality(e.target.value)} // Update state
          />
          <Button
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition"
            onClick={handleDelivery} // Call handler on click
          >
            Confirm
          </Button>
        </CardContent>
      </Card>

      {/* List of confirmed deliveries */}
      <h3 className="text-xl font-semibold mb-4">Confirmed Deliveries</h3>
      <div className="grid gap-4">
        {deliveries.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-4">
              <div className="font-semibold">Product #{d.productId}</div>
              <div className="text-sm text-white/70">Quality: {d.quality}</div>
              <div className="text-sm text-white/70">
                Status: <span className="font-medium">{d.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
