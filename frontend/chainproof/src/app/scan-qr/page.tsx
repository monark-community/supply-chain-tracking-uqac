"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner"


export default function ScanQR() {
  const [value, setValue] = useState("")
  const [scan, setScan] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Verify Product Authenticity
      </h2>

      <div className="mx-auto max-w-3xl rounded-xl bg-card p-6 border border-white/10">
        <div className="flex gap-3">
          <Input
            placeholder="Enter QR data or product ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
         <Button
  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
  onClick={() => setResult(value || null)}
>
  Verify
</Button>

<Button
  variant="secondary"
  className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 transition"
  onClick={() => setScan((v) => !v)}
>
  {scan ? "Close" : "Scan"}
</Button>
        </div>

        {scan && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <Scanner
              onScan={(detected: IDetectedBarcode[]) => {
                if (detected && detected.length > 0) {
                  // We retrieve the value of the first detected code
                  setResult(detected[0].rawValue)
                  setScan(false)
                }
              }}
              onError={(err) => console.error("Scanner error:", err)}
            />
          </div>
        )}

        {result && (
          <div className="mt-6 text-sm text-white/80">
            Résultat: <span className="font-mono">{result}</span>
          </div>
        )}
      </div>
    </section>
  )
}
