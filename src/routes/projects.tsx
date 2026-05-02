import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Section, SectionHeader, GlassCard } from "@/components/site/Section";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — NebulaLabs" },
      { name: "description", content: "Selected case studies — fintech, AI, health, e-commerce, dev tools and more." },
      { property: "og:title", content: "Projects — NebulaLabs" },
      { property: "og:description", content: "A selection of products we've designed and engineered." },
    ],
  }),
  component: ProjectsPage,
});

const CATEGORIES = ["All", "Web", "Mobile", "AI", "SaaS", "Fintech"] as const;

const PROJECTS = [
  { name: "Helios Bank", cat: "Fintech", tag: "Banking app rebuild", grad: "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.70 0.20 200))", h: "h-72" },
  { name: "Atlas AI", cat: "AI", tag: "Agent platform for ops", grad: "linear-gradient(135deg, oklch(0.65 0.24 305), oklch(0.55 0.22 250))", h: "h-96" },
  { name: "Vertex Health", cat: "Mobile", tag: "Patient companion app", grad: "linear-gradient(135deg, oklch(0.70 0.20 200), oklch(0.65 0.24 305))", h: "h-80" },
  { name: "Quantum CRM", cat: "SaaS", tag: "Multi-tenant sales OS", grad: "linear-gradient(135deg, oklch(0.65 0.24 305), oklch(0.70 0.20 265))", h: "h-72" },
  { name: "Obsidian Cloud", cat: "Web", tag: "Developer platform", grad: "linear-gradient(135deg, oklch(0.55 0.20 220), oklch(0.55 0.25 280))", h: "h-96" },
  { name: "Parallax Pay", cat: "Fintech", tag: "Cross-border payments", grad: "linear-gradient(135deg, oklch(0.70 0.20 265), oklch(0.82 0.16 200))", h: "h-72" },
  { name: "Nimbus AI", cat: "AI", tag: "RAG search for legal", grad: "linear-gradient(135deg, oklch(0.50 0.25 295), oklch(0.65 0.20 220))", h: "h-80" },
  { name: "Forge Studio", cat: "SaaS", tag: "Design collaboration", grad: "linear-gradient(135deg, oklch(0.82 0.16 200), oklch(0.65 0.24 305))", h: "h-72" },
];

function ProjectsPage() {
  const [active, setActive] = useState<typeof CATEGORIES[number]>("All");
  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === active);

  return (
    <>
      <Section className="!pt-10">
        <SectionHeader
          eyebrow="Selected work"
          title={<>Products we've <span className="text-gradient">shipped</span></>}
          description="A curated look at recent engagements — click through for case studies."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === c ? "text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
              style={active === c ? { background: "var(--gradient-primary)" } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="mb-5 break-inside-avoid"
              >
                <GlassCard className="!p-0 overflow-hidden">
                  <div className={`relative ${p.h} overflow-hidden`} style={{ background: p.grad }}>
                    <div className="absolute inset-0 bg-grid opacity-20" />
                    <div className="absolute inset-x-5 bottom-5 glass rounded-xl p-3">
                      <div className="h-2 w-20 rounded bg-white/40" />
                      <div className="mt-2 h-2 w-32 rounded bg-white/20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.cat} · {p.tag}</p>
                      <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <a href="#" className="glass flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a href="#" className="glass flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
                        <Github className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
