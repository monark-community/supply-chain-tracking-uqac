import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconImmutable, IconScan, IconTrace } from "@/components/icons"
import { Button } from "@/components/ui/button"

const core = [
  {
    title: "Immutable Tracking",
    desc: "Every transfer and update is recorded immutably, creating an auditable provenance trail from origin to shelf.",
    icon: <IconImmutable className="text-primary" />,
  },
  {
    title: "Quick Verification",
    desc: "Consumers scan a QR or tap an NFC tag to instantly confirm authenticity and view a concise provenance summary.",
    icon: <IconScan className="text-accent" />,
  },
  {
    title: "Event-Based Traceability",
    desc: "Producers, transporters and retailers can append signed events (time, location, conditions) for full visibility.",
    icon: <IconTrace className="text-secondary-foreground" />,
  },
]

const testimonials = [
  {
    quote: "Using ChainProof reduced our returns by catching distribution issues earlier.",
    author: "Operations Lead, Café Verde",
  },
  {
    quote: "Customers appreciate the transparency — trust increased visibly.",
    author: "Head of Retail, FreshMarket",
  },
]

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="container py-16 hero">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Supply chain provenance made simple and trustworthy
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              ChainProof connects physical goods to verifiable digital records. Enable brands,
              logisticians and consumers to check origin, handling and authenticity — without
              exposing sensitive raw data.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/scan-qr">Verify a product</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>

            <ul className="mt-8 grid gap-3">
              <li className="text-sm text-muted-foreground">• Fast verification in seconds (QR/NFC)</li>
              <li className="text-sm text-muted-foreground">• Tamper-evident event timeline</li>
              <li className="text-sm text-muted-foreground">• Lightweight UX for consumers and operators</li>
            </ul>
          </div>

          <div className="order-first lg:order-last">
            {/* Simple illustrative card to the right — non-critical visual */}
            <Card className="p-6 shadow-lg">
              <CardHeader>
                <CardTitle>Live verification demo</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Try scanning a QR on a product (demo mode) to see a condensed provenance summary
                and verification status. No account required for verification.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {core.map((c) => (
            <Card key={c.title} className="hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{c.icon}</div>
                  <CardTitle>{c.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">{c.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section className="container py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">How it works — preview</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto">
          A typical flow: the producer registers the batch and attaches a QR/NFC; transporters
          append signed events during handling; retailers confirm receipt and quality; consumers
          scan the product to check a short, human-friendly verification summary.
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-12 bg-surface">
        <h3 className="text-xl font-semibold mb-6 text-center">Trusted by teams</h3>
        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Card key={i} className="p-6">
              <CardContent>
                <blockquote className="text-muted-foreground">“{t.quote}”</blockquote>
                <div className="mt-4 text-sm font-medium">{t.author}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="container py-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} ChainProof — All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/how-it-works">How it works</Link>
            <Link href="#features">Features</Link>
            <Link href="/retail">Retail</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
