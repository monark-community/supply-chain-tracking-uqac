import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Features data to display in cards
const features = [
  {
    title: "Blockchain Security",
    desc: "Immutable records prevent tampering or fraud.", // Explain security benefit
  },
  {
    title: "Transparency",
    desc: "Every stakeholder can verify the supply chain state.", // Explain transparency
  },
  {
    title: "QR Verification",
    desc: "Consumers scan a QR to verify authenticity instantly.", // Explain QR feature
  },
];

// Features section component
export default function Features() {
  return (
    <section className="container py-12">
      {/* Section heading */}
      <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

      {/* Grid layout for feature cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <Card key={f.title} className="bg-card border-white/10">
            {/* Card header with title */}
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>

            {/* Card content with description */}
            <CardContent className="text-white/70">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
