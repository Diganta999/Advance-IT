import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Smartphone, Palette, Cloud, GitBranch, Cpu, Shield, Network, Box, Plug, ArrowRight } from "lucide-react";
import { Section, SectionHeader, GlassCard } from "@/components/site/Section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — NebulaLabs" },
      { name: "description", content: "Web, mobile, design, cloud, DevOps, AI, security, networking, SaaS and API development services." },
      { property: "og:title", content: "Services — NebulaLabs" },
      { property: "og:description", content: "Ten end-to-end engineering services for product teams." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { icon: Code2, title: "Web Development", desc: "Type-safe, production-grade web apps built on React, Next.js, TanStack and edge runtimes.", tech: ["React", "Next.js", "TanStack", "Node"] },
  { icon: Smartphone, title: "Mobile App Development", desc: "iOS and Android apps with native performance and shared business logic.", tech: ["Swift", "Kotlin", "React Native", "Expo"] },
  { icon: Palette, title: "UI / UX Design", desc: "Brand-defining design systems, user research and conversion-focused product flows.", tech: ["Figma", "Framer", "Storybook"] },
  { icon: Cloud, title: "Cloud Solutions", desc: "Multi-cloud architecture and migrations on AWS, GCP, Azure and Cloudflare.", tech: ["AWS", "GCP", "Cloudflare", "K8s"] },
  { icon: GitBranch, title: "DevOps", desc: "CI/CD, IaC, observability and platform engineering — ship faster, sleep better.", tech: ["Terraform", "GitHub Actions", "Datadog"] },
  { icon: Cpu, title: "AI Solutions", desc: "Custom LLM agents, RAG pipelines, fine-tuning and ML systems shipped to production.", tech: ["OpenAI", "Anthropic", "LangChain", "PyTorch"] },
  { icon: Shield, title: "Cyber Security", desc: "Penetration testing, SOC 2 / ISO readiness and zero-trust architectures.", tech: ["SOC 2", "ISO 27001", "OWASP"] },
  { icon: Network, title: "Network Solutions", desc: "Secure networking, SD-WAN, VPN and global edge connectivity.", tech: ["Cloudflare", "Tailscale", "Wireguard"] },
  { icon: Box, title: "SaaS Development", desc: "End-to-end multi-tenant SaaS platforms with billing, auth and analytics built-in.", tech: ["Stripe", "Auth", "Postgres"] },
  { icon: Plug, title: "API Development", desc: "REST, GraphQL and event-driven APIs designed for scale and developer experience.", tech: ["GraphQL", "tRPC", "OpenAPI"] },
];

const PROCESS = [
  { step: "01", title: "Discover", desc: "Workshops, research and audits to align on the real problem." },
  { step: "02", title: "Design", desc: "Wireframes, prototypes and a complete design system." },
  { step: "03", title: "Build", desc: "Senior engineering squad ships in weekly sprints with demos." },
  { step: "04", title: "Launch & scale", desc: "Production hardening, observability and ongoing iteration." },
];

function ServicesPage() {
  return (
    <>
      <Section className="!pt-10">
        <SectionHeader
          eyebrow="Services"
          title={<>Ten capabilities. <span className="text-gradient">One senior team.</span></>}
          description="From the first discovery call to the millionth user, we cover the full product surface area."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <GlassCard key={s.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.tech.map((t) => (
                  <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="How we work" title={<>A proven <span className="text-gradient">process</span></>} />
        <div className="grid gap-5 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <GlassCard key={p.step}>
              <div className="text-3xl font-semibold text-gradient">{p.step}</div>
              <h4 className="mt-4 font-semibold">{p.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section>
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
          <div className="absolute -top-20 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-primary)" }} />
          <h3 className="relative text-3xl font-semibold sm:text-4xl">Need something we didn't list?</h3>
          <p className="relative mt-3 text-muted-foreground">If it ships software, we can probably build it.</p>
          <Link to="/contact" className="relative mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}>
            Talk to a strategist <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
