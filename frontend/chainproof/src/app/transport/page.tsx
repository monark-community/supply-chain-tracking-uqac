"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TransportPage() {
  const [productId, setProductId] = useState("")
  const [location, setLocation] = useState("")
  const [temperature, setTemperature] = useState("")
  const [updates, setUpdates] = useState<any[]>([])

  function handleUpdate() {
    if (!productId || !location || !temperature) return
    const update = {
      id: updates.length + 1,
      productId,
      location,
      temperature,
      status: "In Transit",
    }
    setUpdates([...updates, update])
    setProductId("")
    setLocation("")
    setTemperature("")
  }

  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold mb-8">Transport Dashboard</h2>

      <Card className="max-w-lg mb-10">
        <CardHeader>
          <CardTitle>Update Product Transport</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
          <Button
  className="bg-gradient-to-r from-sky-500 to-emerald-400 hover:opacity-90 transition"
  onClick={handleUpdate}
>
  Update
</Button>

        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold mb-4">Transport History</h3>
      <div className="grid gap-4">
        {updates.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4">
              <div className="font-semibold">Product #{u.productId}</div>
              <div className="text-sm text-white/70">Location: {u.location}</div>
              <div className="text-sm text-white/70">Temperature: {u.temperature}°C</div>
              <div className="text-sm text-white/70">
                Status: <span className="font-medium">{u.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
