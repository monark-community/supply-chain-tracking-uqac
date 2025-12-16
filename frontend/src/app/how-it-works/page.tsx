"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Factory, ShoppingBag, QrCode } from "lucide-react"
import { motion } from "framer-motion"

// Steps data for "How It Works" section — descriptive text only, no navigation
const steps = [
  {
    id: "01",
    title: "Producer / Origin",
    desc:
      "The producer creates a product record including origin, batch identifiers and certifications. This record ties a product's physical batch to a digital identifier (QR/NFC). Producers can attach certificates (e.g., organic, fair-trade) and initial quality checks.",
    icon: <Factory className="h-8 w-8 text-emerald-400" />,
  },
  {
    id: "02",
    title: "Logistics & Transport",
    desc:
      "Each handoff (transporter, cold-storage, checkpoint) can append a signed event: time, location, temperature, and handler identity. These events form a tamper-evident timeline that helps identify where issues occurred.",
    icon: <Truck className="h-8 w-8 text-sky-400" />,
  },
  {
    id: "03",
    title: "Retail / Receiving",
    desc:
      "Retailers confirm receipt, perform spot quality checks and record sale-related events. The retail entry links the product's digital trace to the point-of-sale, enabling customer-facing verification later.",
    icon: <ShoppingBag className="h-8 w-8 text-yellow-400" />,
  },
  {
    id: "04",
    title: "Consumer Verification",
    desc:
      "Consumers scan the QR/NFC on the product to view a condensed provenance summary and a verification status. The UI surfaces key facts — origin, critical checkpoints and a short verification result — without exposing raw on-chain data.",
    icon: <QrCode className="h-8 w-8 text-pink-400" />,
  },
]

// Component rendering the "How It Works" section
export default function HowItWorks() {
  return (
    <section className="container py-16">
      {/* Section heading */}
      <h2 className="text-3xl font-bold text-center mb-12">How It Works (demo)</h2>

      {/* Grid layout for steps — descriptive cards only */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            {/* Card with subtle hover, not navigable */}
            <Card className="group relative bg-card border-white/6 shadow-md rounded-2xl transition">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/8 transition">
                  {step.icon}
                </div>
                <CardTitle className="text-lg font-semibold tracking-wide">
                  {step.id}. {step.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground text-center">
                {step.desc}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
