"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner"
import { API_URL } from "@/lib/env"

// Transaction interface representing each product transaction
interface Transaction {
  uid: string
  productUid: string
  country: string
  province: string
  actorName: string
  timestamp: string
  quantity: string | number
  unit: string
  eventType: string
  actor: string
  humidity: number
  temperature: number
  criticalEvent: boolean
  transportDocRef: string
}

// ScanQR component for verifying product authenticity
export default function ScanQR() {
  // State variables
  const [value, setValue] = useState("") // QR code or product ID input
  const [scan, setScan] = useState(false) // Toggle QR scanner
  const [result, setResult] = useState<string | null>(null) // Scanned or entered value
  const [transactions, setTransactions] = useState<Transaction[]>([]) // Transactions for the product
  const [loading, setLoading] = useState(false) // Loading state for fetching transactions

  // Fetch transactions from backend for a given product ID
  const fetchTransactions = async (productId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/transactions`)
      if (!res.ok) throw new Error("No transactions found")
      const data: Transaction[] = await res.json()
      setTransactions(data.flat()) // Flatten in case of nested arrays
    } catch (err) {
      setTransactions([]) // Reset if error occurs
    } finally {
      setLoading(false)
    }
  }

  // Handle verification when user inputs ID or scans QR
  const handleVerify = () => {
    if (!value) return
    setResult(value) // Set displayed result
    fetchTransactions(value) // Fetch related transactions
  }

  return (
    <section className="container py-12">
      {/* Page heading */}
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        Verify Product Authenticity
      </h2>

      {/* Card container for input and scanner */}
      <div className="mx-auto max-w-3xl rounded-xl bg-gray-800/80 p-6 border border-white/10">
        <div className="flex gap-3 mb-4">
          {/* Input for manual product ID or QR data */}
          <Input
            placeholder="Enter QR data or product ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-gray-700/50 text-white placeholder-white/50"
          />

          {/* Button to verify input */}
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
            onClick={handleVerify}
          >
            Verify
          </Button>

          {/* Button to toggle QR scanner */}
          <Button
            variant="secondary"
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 transition"
            onClick={() => setScan((v) => !v)}
          >
            {scan ? "Close" : "Scan"}
          </Button>
        </div>

        {/* QR Scanner section */}
        {scan && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <Scanner
              onScan={(detected: IDetectedBarcode[]) => {
                if (detected && detected.length > 0) {
                  // Use the first detected QR code
                  setResult(detected[0].rawValue)
                  setValue(detected[0].rawValue)
                  setScan(false) // Close scanner
                  fetchTransactions(detected[0].rawValue) // Fetch transactions
                }
              }}
            />
          </div>
        )}

        {/* Display transactions */}
        {result && (
          <div className="mt-6 text-white">
            <div className="mb-3 font-mono">Product ID: {result}</div>

            {loading ? (
              <p className="text-white/70">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-white/70">No transactions found.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.uid} className="bg-gray-700/60 p-3 rounded-md text-white text-sm">
                    <div><strong>Event:</strong> {tx.eventType}</div>
                    <div><strong>Actor:</strong> {tx.actorName} ({tx.actor})</div>
                    <div><strong>Location:</strong> {tx.country}, {tx.province}</div>
                    <div><strong>Quantity:</strong> {tx.quantity} {tx.unit}</div>
                    <div><strong>Timestamp:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</div>
                    <div><strong>Temp:</strong> {tx.temperature}°C, <strong>Humidity:</strong> {tx.humidity}%</div>
                    {tx.transportDocRef && <div><strong>Transport Doc:</strong> {tx.transportDocRef}</div>}
                    {tx.criticalEvent && <div className="text-red-400 font-semibold">Critical Event!</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
