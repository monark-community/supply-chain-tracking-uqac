import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Blockchain Security",
    desc: "Immutable records prevent tampering or fraud.",
  },
  {
    title: "Transparency",
    desc: "Every stakeholder can verify the supply chain state.",
  },
  {
    title: "QR Verification",
    desc: "Consumers scan a QR to verify authenticity instantly.",
  },
]

export default function Features() {
  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <Card key={f.title} className="bg-card border-white/10">
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-white/70">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
