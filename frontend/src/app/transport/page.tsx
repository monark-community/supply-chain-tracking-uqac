"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// TransportPage component allows updating and viewing product transport info
export default function TransportPage() {
  // State variables for input fields
  const [productId, setProductId] = useState("") // Product ID input
  const [location, setLocation] = useState("") // Current location input
  const [temperature, setTemperature] = useState("") // Temperature input
  const [updates, setUpdates] = useState<any[]>([]) // List of transport updates

  // Handle adding a new transport update
  function handleUpdate() {
    if (!productId || !location || !temperature) return // Validate inputs

    // Create a new update object
    const update = {
      id: updates.length + 1, // Unique ID for the update
      productId,
      location,
      temperature,
      status: "In Transit", // Default status
    }

    // Add new update to state
    setUpdates([...updates, update])

    // Clear input fields
    setProductId("")
    setLocation("")
    setTemperature("")
  }

  return (
    <section className="container py-12">
      {/* Page heading */}
      <h2 className="text-3xl font-bold mb-8">Transport Dashboard</h2>

      {/* Card for adding new transport update */}
      <Card className="max-w-lg mb-10">
        <CardHeader>
          <CardTitle>Update Product Transport</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* Input fields */}
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
          {/* Button to submit transport update */}
          <Button
            className="bg-gradient-to-r from-sky-500 to-emerald-400 hover:opacity-90 transition"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </CardContent>
      </Card>

      {/* Display transport history */}
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
