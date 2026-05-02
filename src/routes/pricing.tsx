import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Section, SectionHeader, GlassCard } from "@/components/site/Section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — NebulaLabs" },
      { name: "description", content: "Transparent engagement pricing — sprints, embedded studios and enterprise programs." },
      { property: "og:title", content: "Pricing — NebulaLabs" },
      { property: "og:description", content: "Transparent engagement pricing for product teams of every size." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Sprint",
    monthly: 12000, yearly: 120000,
    desc: "A focused 2-week engineering or design sprint.",
    features: ["Senior engineer + designer", "Daily Slack updates", "End-of-sprint demo", "All code & assets owned by you"],
  },
  {
    name: "Studio",
    monthly: 28000, yearly: 280000,
    desc: "An embedded squad — your team, on demand.",
    features: ["3 senior team members", "Weekly product demos", "Roadmap & PM included", "Production support included", "Priority response (4h SLA)"],
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: null, yearly: null,
    desc: "Multi-team programs for large organizations.",
    features: ["Dedicated multi-team org", "Custom SLA & DPA", "SOC 2 / ISO compliant delivery", "On-prem or VPC delivery", "Executive sponsor"],
  },
];

const FAQS = [
  { q: "How quickly can you start?", a: "Typically within 2 weeks. For sprints, often within days." },
  { q: "Do we own the code?", a: "Yes — fully. All IP, code and design assets transfer to you on day one." },
  { q: "Can you work with our existing team?", a: "Absolutely. About 60% of our engagements augment internal teams." },
  { q: "What time zones do you cover?", a: "PST, CET and SGT — we have at least 6 hours of overlap with most clients." },
  { q: "Do you sign NDAs and DPAs?", a: "Yes, standard practice on every engagement." },
];

function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Section className="!pt-10">
        <SectionHeader
          eyebrow="Pricing"
          title={<>Engagements that <span className="text-gradient">fit your stage</span></>}
          description="No retainer lock-in. Cancel any time after the first 30 days."
        />

        <div className="mb-10 flex justify-center">
          <div className="glass inline-flex rounded-full p-1">
            {(["Monthly", "Yearly"] as const).map((label, i) => {
              const isYearly = i === 1;
              const active = yearly === isYearly;
              return (
                <button
                  key={label}
                  onClick={() => setYearly(isYearly)}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${active ? "text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {active && (
                    <motion.span layoutId="bill-toggle" className="absolute inset-0 rounded-full"
                      style={{ background: "var(--gradient-primary)" }} />
                  )}
                  <span className="relative">{label} {isYearly && <span className="ml-1 text-xs opacity-80">−15%</span>}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = p.monthly == null ? "Custom" : yearly ? `$${(p.yearly! * 0.85 / 12 / 1000).toFixed(0)}k/mo` : `$${(p.monthly / 1000).toFixed(0)}k/mo`;
            return (
              <GlassCard key={p.name} className={p.featured ? "border-gradient !bg-white/[0.08]" : ""}>
                {p.featured && (
                  <span className="absolute right-6 top-6 rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}>Most popular</span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 text-4xl font-semibold tracking-tight">{price}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact"
                  className={`mt-7 inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${p.featured ? "text-primary-foreground" : "glass text-foreground hover:bg-white/10"}`}
                  style={p.featured ? { background: "var(--gradient-primary)" } : {}}
                >
                  {p.monthly == null ? "Contact sales" : "Get started"}
                </Link>
              </GlassCard>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="FAQ" title={<>Common <span className="text-gradient">questions</span></>} />
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <GlassCard key={f.q} hover={false} className="!p-0">
                <button onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left">
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
                </motion.div>
              </GlassCard>
            );
          })}
        </div>
      </Section>
    </>
  );
}
