"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Factory, ShoppingBag, QrCode } from "lucide-react" // Step icons
import { motion } from "framer-motion" // For animation

// Steps data for "How It Works" section
const steps = [
  {
    id: "01",
    title: "Producer",
    desc: "Create product record with origin & certifications.",
    icon: <Factory className="h-8 w-8 text-emerald-400" />,
    href: "/dashboard",
  },
  {
    id: "02",
    title: "Transport",
    desc: "Update location, temperature, and handling status.",
    icon: <Truck className="h-8 w-8 text-sky-400" />,
    href: "/transport",
  },
  {
    id: "03",
    title: "Retail",
    desc: "Confirm delivery & quality checks.",
    icon: <ShoppingBag className="h-8 w-8 text-yellow-400" />,
    href: "/retail",
  },
  {
    id: "04",
    title: "Consumer",
    desc: "Scan QR to verify authenticity & view full history.",
    icon: <QrCode className="h-8 w-8 text-pink-400" />,
    href: "/scan-qr",
  },
]

// Component rendering the "How It Works" section
export default function HowItWorks() {
  return (
    <section className="container py-16">
      {/* Section heading */}
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

      {/* Grid layout for steps */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30 }} // Start hidden and slightly below
            animate={{ opacity: 1, y: 0 }} // Animate to visible
            transition={{ delay: i * 0.1, duration: 0.4 }} // Stagger animations
          >
            <Link href={step.href}>
              {/* Card with hover effects */}
              <Card className="group relative bg-card border-white/10 shadow-lg rounded-2xl cursor-pointer transition hover:scale-[1.03] hover:border-primary">
                
                {/* Card header with icon and title */}
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 group-hover:ring-primary/40 transition">
                    {step.icon} {/* Step icon */}
                  </div>
                  <CardTitle className="text-lg font-semibold tracking-wide">
                    {step.id}. {step.title} {/* Step number and title */}
                  </CardTitle>
                </CardHeader>

                {/* Card content with description */}
                <CardContent className="text-sm text-white/70 text-center">
                  {step.desc}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
