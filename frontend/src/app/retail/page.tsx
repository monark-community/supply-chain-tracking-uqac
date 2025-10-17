"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function RetailPage() {
  const [productId, setProductId] = useState("")
  const [quality, setQuality] = useState("")
  const [deliveries, setDeliveries] = useState<any[]>([])

  function handleDelivery() {
    if (!productId || !quality) return
    const delivery = {
      id: deliveries.length + 1,
      productId,
      quality,
      status: "Delivered",
    }
    setDeliveries([...deliveries, delivery])
    setProductId("")
    setQuality("")
  }

  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold mb-8">Retail Dashboard</h2>

      <Card className="max-w-lg mb-10">
        <CardHeader>
          <CardTitle>Confirm Delivery</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <Input
            placeholder="Quality Check (e.g. Good / Damaged)"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          />
         <Button
  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition"
  onClick={handleDelivery}
>
  Confirm
</Button>

        </CardContent>
      </Card>

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
