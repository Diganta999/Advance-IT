import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Target, Heart, Globe2 } from "lucide-react";
import { Section, SectionHeader, GlassCard } from "@/components/site/Section";
import { useSettings } from "@/context/SettingsContext";
import { useContent } from "@/context/ContentContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NebulaLabs" },
      { name: "description", content: "Meet the senior engineers and designers behind NebulaLabs — our mission, story and the values that drive our work." },
      { property: "og:title", content: "About NebulaLabs" },
      { property: "og:description", content: "A senior engineering studio with offices in San Francisco, Berlin and Singapore." },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  { year: "2018", title: "Founded in Berlin", desc: "Three engineers leave Big Tech to build a senior-only studio." },
  { year: "2020", title: "First $1M ARR client", desc: "Shipped a fintech platform that scaled to 1M users in 9 months." },
  { year: "2022", title: "Opened SF office", desc: "Expanded to North America with a focus on AI and developer tools." },
  { year: "2024", title: "Series of awards", desc: "Awwwards SOTM × 3, FWA × 2, recognized as a top global studio." },
  { year: "2026", title: "42 engineers, 4 cities", desc: "Now serving 60+ active enterprise customers across 14 countries." },
];

const VALUES = [
  { icon: Target, title: "Outcomes over output", desc: "We measure success in business impact, not deliverables." },
  { icon: Heart, title: "Craft obsession", desc: "Every pixel and every query gets the senior treatment." },
  { icon: Globe2, title: "Global by design", desc: "Distributed teams across 4 time zones, available when you need us." },
  { icon: Award, title: "Long-term partners", desc: "Most clients renew. Average engagement: 22 months." },
];

const TEAM = [
  { name: "Anya Volkov", role: "Co-founder · CEO", img: "/team/anya.png" },
  { name: "Marco Reyes", role: "Co-founder · CTO", img: "/team/marco.png" },
  { name: "Lena Park", role: "Head of Design", img: "/team/lena.png" },
  { name: "Idris Khan", role: "Head of Engineering", img: "/team/idris.png" },
];

function AboutPage() {
  const { settings } = useSettings();
  const { content } = useContent();
  const siteName = settings?.siteName || "NebulaLabs";
  const team = content?.team?.length ? content.team : TEAM;
  return (
    <>
      <Section className="!pt-10">
        <SectionHeader
          eyebrow="About us"
          title={<>A studio of <span className="text-gradient">senior makers</span></>}
          description={`We started ${siteName} in 2018 with one belief: small teams of senior people ship better software than large teams of anyone else.`}
        />
      </Section>

      {/* Mission */}
      <Section className="!py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-2xl font-semibold">Our mission</h3>
            <p className="mt-3 text-muted-foreground">
              Help ambitious companies ship category-defining software faster, with the craftsmanship of a top product team and the velocity of a startup.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-2xl font-semibold">Our vision</h3>
            <p className="mt-3 text-muted-foreground">
              A world where every great idea gets a great engineering team — without compromise on quality, speed or ownership.
            </p>
          </GlassCard>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader eyebrow="Our story" title={<>Eight years of <span className="text-gradient">building</span></>} />
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-secondary sm:left-1/2" />
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative mb-10 flex gap-6 sm:gap-12 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
            >
              <div className="absolute left-4 -translate-x-1/2 sm:left-1/2">
                <span className="block h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
              </div>
              <div className="ml-12 flex-1 sm:ml-0">
                <GlassCard>
                  <div className="text-sm font-semibold text-accent">{item.year}</div>
                  <h4 className="mt-1 text-lg font-semibold">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </GlassCard>
              </div>
              <div className="hidden flex-1 sm:block" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader eyebrow="What drives us" title={<>Our <span className="text-gradient">values</span></>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <GlassCard key={v.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="mt-5 font-semibold">{v.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader eyebrow="Leadership" title={<>Meet the <span className="text-gradient">team</span></>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <GlassCard key={m.name} className="!p-0 overflow-hidden group">
              <div className="aspect-square w-full overflow-hidden relative">
                <img 
                  src={m.imageUrl || m.img} 
                  alt={m.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-lg">{m.name}</h4>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section>
        <SectionHeader eyebrow="Capabilities" title={<>Where we <span className="text-gradient">excel</span></>} />
        <GlassCard className="!p-8 sm:!p-10">
          <div className="space-y-6">
            {[
              ["Frontend engineering (React, Next, TanStack)", 98],
              ["Cloud architecture (AWS, GCP, Cloudflare)", 94],
              ["AI / ML systems (LLM, RAG, agents)", 92],
              ["Mobile (iOS, Android, React Native)", 88],
              ["Design systems & product design", 96],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{label}</span><span className="text-muted-foreground">{val}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${val}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-accent)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Section>
    </>
  );
}
