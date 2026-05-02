import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Smartphone, Cloud, Shield, Cpu, Palette, Rocket, Star, CheckCircle2, Quote } from "lucide-react";
import { Section, SectionHeader, GlassCard } from "@/components/site/Section";
import { useSettings } from "@/context/SettingsContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NebulaLabs — Premium Software Engineering Studio" },
      { name: "description", content: "Award-winning IT studio building web, mobile, cloud, AI and security products for ambitious companies." },
      { property: "og:title", content: "NebulaLabs — Premium Software Engineering Studio" },
      { property: "og:description", content: "Award-winning IT studio building web, mobile, cloud, AI and security products." },
    ],
  }),
  component: HomePage,
});

const STATS = [
  { value: "240+", label: "Products shipped" },
  { value: "98%", label: "Client retention" },
  { value: "42", label: "Engineers worldwide" },
  { value: "12", label: "Industry awards" },
];

const SERVICES = [
  { icon: Code2, title: "Web Development", desc: "Lightning-fast, type-safe Next.js & TanStack apps engineered to scale." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Cross-platform iOS & Android experiences with native performance." },
  { icon: Palette, title: "UI / UX Design", desc: "Design systems and product flows that convert and delight." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Resilient cloud infra on AWS, GCP and Cloudflare with full observability." },
  { icon: Cpu, title: "AI Solutions", desc: "Custom LLM agents, RAG pipelines and ML systems shipped to production." },
  { icon: Shield, title: "Cyber Security", desc: "Pen-tests, SOC 2 readiness and zero-trust architectures." },
];

const LOGOS = ["NORTHWIND", "ACME", "PARALLAX", "VERTEX", "OBSIDIAN", "QUANTUM", "HELIOS", "ATLAS"];

const PROJECTS = [
  { name: "Helios Banking", tag: "Fintech · Web", grad: "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.70 0.20 200))" },
  { name: "Atlas AI", tag: "AI · SaaS", grad: "linear-gradient(135deg, oklch(0.65 0.24 305), oklch(0.55 0.22 250))" },
  { name: "Vertex Mobile", tag: "Mobile · Health", grad: "linear-gradient(135deg, oklch(0.70 0.20 200), oklch(0.65 0.24 305))" },
];

const TESTIMONIALS = [
  { quote: "NebulaLabs rebuilt our entire platform in 14 weeks. Conversion is up 38% and infra costs dropped by half.", name: "Mira Tan", role: "CTO, Helios Bank" },
  { quote: "The most senior engineering team we've worked with. They ship like a startup and operate like an enterprise.", name: "Dan Ortega", role: "VP Eng, Atlas AI" },
  { quote: "From design system to deployment, the work is exceptional. Easily the best agency engagement we've had.", name: "Priya Shah", role: "Head of Product, Vertex" },
];

function HomePage() {
  const { settings } = useSettings();
  return (
    <>
      {/* HERO */}
      <Section className="!pt-10 sm:!pt-16">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Now booking Q3 engagements
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              Software that feels like <span className="text-gradient">the future</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
              {settings?.siteDescription || "We're a senior engineering studio designing and building category-defining web, mobile, cloud and AI products for ambitious teams."}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/projects"
                className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                See our work
              </Link>
            </div>
          </motion.div>

          {/* Hero glass dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div className="absolute -inset-8 -z-10 rounded-[3rem] opacity-60 blur-3xl"
              style={{ background: "var(--gradient-primary)" }} />
            <div className="glass-strong overflow-hidden rounded-3xl p-2">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 text-xs text-muted-foreground">nebulalabs.dev / dashboard</span>
              </div>
              <div className="grid gap-3 rounded-2xl bg-black/30 p-4 sm:grid-cols-3">
                {[
                  { k: "MRR", v: "$248,910", d: "+18.2%" },
                  { k: "Active users", v: "42,184", d: "+9.4%" },
                  { k: "Uptime", v: "99.998%", d: "30d" },
                ].map((s) => (
                  <div key={s.k} className="glass rounded-xl p-4">
                    <div className="text-xs text-muted-foreground">{s.k}</div>
                    <div className="mt-1 text-2xl font-semibold tracking-tight">{s.v}</div>
                    <div className="mt-1 text-xs text-accent">{s.d}</div>
                  </div>
                ))}
                <div className="glass relative col-span-full h-44 overflow-hidden rounded-xl p-4">
                  <div className="text-xs text-muted-foreground">Throughput · last 24h</div>
                  <svg viewBox="0 0 600 120" className="absolute inset-x-0 bottom-0 h-32 w-full">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.70 0.20 265)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="oklch(0.70 0.20 265)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,90 C60,70 90,40 150,55 C210,70 240,30 300,45 C360,60 390,20 450,35 C510,50 540,15 600,30 L600,120 L0,120 Z" fill="url(#g1)" />
                    <path d="M0,90 C60,70 90,40 150,55 C210,70 240,30 300,45 C360,60 390,20 450,35 C510,50 540,15 600,30" fill="none" stroke="oklch(0.82 0.16 200)" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* LOGOS marquee */}
      <Section className="!py-10">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted by teams at</p>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-16">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span key={i} className="text-2xl font-bold tracking-[0.2em] text-white/30">{l}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* STATS */}
      <Section className="!py-12">
        <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/5 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-background/40 p-8 text-center backdrop-blur-xl">
              <div className="text-4xl font-semibold text-gradient sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section>
        <SectionHeader
          eyebrow="What we do"
          title={<>End-to-end engineering for <span className="text-gradient">modern teams</span></>}
          description="From the first wireframe to the millionth user, we own the entire product stack."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "var(--gradient-primary)" }}>
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <Link to="/services" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section>
        <SectionHeader
          eyebrow="Featured work"
          title={<>Selected <span className="text-gradient">projects</span></>}
          description="A few recent products we've designed and built end-to-end."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <GlassCard className="!p-0">
                <div className="relative h-56 overflow-hidden rounded-t-2xl" style={{ background: p.grad }}>
                  <div className="absolute inset-0 bg-grid opacity-30" />
                  <div className="absolute inset-x-6 bottom-6 glass rounded-xl p-3">
                    <div className="h-2 w-24 rounded bg-white/40" />
                    <div className="mt-2 h-2 w-40 rounded bg-white/20" />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.tag}</p>
                  <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/projects" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
            View all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <SectionHeader
          eyebrow="Testimonials"
          title={<>Loved by <span className="text-gradient">operators</span></>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <GlassCard>
                <Quote className="h-6 w-6 text-accent" />
                <p className="mt-4 text-base leading-relaxed">{t.quote}</p>
                <div className="mt-6 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PRICING preview */}
      <Section>
        <SectionHeader
          eyebrow="Engagements"
          title={<>Engagements that <span className="text-gradient">scale with you</span></>}
          description="Pick the model that fits your stage. Every plan includes a senior team and full ownership."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { name: "Sprint", price: "$12k", desc: "2-week design or engineering sprint to ship a focused outcome." },
            { name: "Studio", price: "$28k/mo", desc: "Embedded squad of 3 — design + engineering + PM.", featured: true },
            { name: "Enterprise", price: "Custom", desc: "Multi-team programs, SLA, security review and on-prem options." },
          ].map((p) => (
            <GlassCard key={p.name} className={p.featured ? "border-gradient" : ""}>
              {p.featured && (
                <span className="absolute right-6 top-6 rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}>Popular</span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-3 text-4xl font-semibold tracking-tight">{p.price}</div>
              <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {["Senior team", "Weekly demos", "Code & IP ownership", "Post-launch support"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-7 inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}>
                Choose {p.name}
              </Link>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-16">
          <div className="absolute -top-20 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
            style={{ background: "var(--gradient-primary)" }} />
          <Rocket className="relative mx-auto h-10 w-10 text-accent" />
          <h2 className="relative mt-4 text-balance text-3xl font-semibold sm:text-5xl">
            Ready to build something <span className="text-gradient">extraordinary</span>?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your project — we'll reply within one business day with a tailored proposal.
          </p>
          <Link to="/contact"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
