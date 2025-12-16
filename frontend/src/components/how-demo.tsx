"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowDemo() {
  const [stage, setStage] = useState<"idle" | "scanning" | "tracing" | "proof" | "done">("idle")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (stage === "scanning") setMessage("Scanning QR code... reading product identifier")
    if (stage === "tracing") setMessage("Fetching provenance: origin → processor → distributor → retailer")
    if (stage === "proof") setMessage("Generating cryptographic proof and verifying on-chain record")
    if (stage === "done") setMessage("Product verified — authenticity confirmed")
  }, [stage])

  const startDemo = () => {
    setStage("scanning")
    setTimeout(() => setStage("tracing"), 1200)
    setTimeout(() => setStage("proof"), 2400)
    setTimeout(() => setStage("done"), 3600)
  }

  const reset = () => {
    setStage("idle")
    setMessage("")
  }

  return (
    <div className="mt-8">
      <Card className="bg-muted/5">
        <CardHeader>
          <CardTitle>Live Demo (mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is an in-page demo that simulates scanning a QR, tracing the supply chain and
            producing a proof. No data is sent to the server — it is a visual mock to show the user
            experience.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10">
                {stage === "idle" ? "⏺" : stage === "scanning" ? "📷" : stage === "tracing" ? "🔎" : stage === "proof" ? "🔐" : "✅"}
              </div>
              <div>
                <div className="font-medium">{stage === "idle" ? "Ready to demo" : message}</div>
                {stage === "done" && (
                  <div className="text-sm text-muted-foreground mt-1">Sample product: SKU 12345 — Origin: Farm A</div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {stage === "idle" && (
                <Button onClick={startDemo}>Start demo</Button>
              )}
              {stage !== "idle" && (
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
