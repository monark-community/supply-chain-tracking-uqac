import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Core features to display on the homepage
const core = [
  { title: "Immutable Tracking", desc: "Every transfer is recorded on-chain to prevent fraud." },
  { title: "QR Code Scanning", desc: "Consumers verify authenticity by scanning codes." },
  { title: "Role-Based Access", desc: "Smart contracts manage granular permissions." },
]

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className="container pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          Built for the <span className="text-accent">Future</span>
        </h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Cutting-edge blockchain meets intuitive design for seamless supply chain management.
        </p>
        {/* Placeholder div for spacing or future elements */}
        <div className="p-10 space-y-4"></div>
      </section>

      {/* Core features section */}
      <section className="container grid gap-6 md:grid-cols-3">
        {core.map((c) => (
          <Card key={c.title} className="bg-card border-white/10">
            {/* Feature title */}
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            {/* Feature description */}
            <CardContent className="text-white/70">{c.desc}</CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}
