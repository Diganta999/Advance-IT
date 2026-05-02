import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { Section, SectionHeader, GlassCard } from "@/components/site/Section";
import { useSettings } from "@/context/SettingsContext";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NebulaLabs" },
      { name: "description", content: "Get in touch with NebulaLabs — offices in San Francisco, Berlin and Singapore." },
      { property: "og:title", content: "Contact NebulaLabs" },
      { property: "og:description", content: "Tell us about your project. We reply within one business day." },
    ],
  }),
  component: ContactPage,
});

const OFFICES = [
  { city: "San Francisco", addr: "548 Market St · CA 94104", time: "GMT−8" },
  { city: "Berlin", addr: "Torstraße 164 · 10115", time: "GMT+1" },
  { city: "Singapore", addr: "10 Anson Rd · 079903", time: "GMT+8" },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      <Section className="!pt-10">
        <SectionHeader
          eyebrow="Contact"
          title={<>Let's build <span className="text-gradient">something great</span></>}
          description="Tell us about your project. We reply within one business day."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <GlassCard hover={false} className="!p-8">
              {sent ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-accent" />
                  <h3 className="mt-4 text-2xl font-semibold">Message received</h3>
                  <p className="mt-2 text-muted-foreground">We'll be in touch within one business day.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" name="name" placeholder="Anya Volkov" />
                    <Field label="Email" name="email" type="email" placeholder="anya@company.com" />
                  </div>
                  <Field label="Company" name="company" placeholder="Helios Bank" />
                  <div>
                    <label className="mb-2 block text-sm font-medium">Budget</label>
                    <div className="flex flex-wrap gap-2">
                      {["< $25k", "$25k – $75k", "$75k – $250k", "$250k+"].map((b) => (
                        <label key={b} className="glass cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-white/10">
                          <input type="radio" name="budget" className="sr-only peer" />
                          <span className="peer-checked:text-accent">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Project details</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your goals, timeline and team…"
                      className="glass w-full rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                  >
                    Send message <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </GlassCard>
          </div>

          {/* Info */}
          <div className="space-y-5 lg:col-span-2">
            <GlassCard>
              <Mail className="h-5 w-5 text-accent" />
              <h4 className="mt-4 font-semibold">Email</h4>
              <p className="text-sm text-muted-foreground">{settings?.contactEmail || "hello@nebulalabs.dev"}</p>
            </GlassCard>
            <GlassCard>
              <Phone className="h-5 w-5 text-accent" />
              <h4 className="mt-4 font-semibold">Phone</h4>
              <p className="text-sm text-muted-foreground">+1 (415) 555-0144</p>
            </GlassCard>
            <GlassCard>
              <MessageCircle className="h-5 w-5 text-accent" />
              <h4 className="mt-4 font-semibold">Live chat</h4>
              <p className="text-sm text-muted-foreground">Mon – Fri · 8am to 8pm GMT</p>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* Offices */}
      <Section>
        <SectionHeader eyebrow="Our offices" title={<>Three cities, <span className="text-gradient">one team</span></>} />
        <div className="grid gap-5 lg:grid-cols-3">
          {OFFICES.map((o) => (
            <GlassCard key={o.city}>
              <MapPin className="h-5 w-5 text-accent" />
              <h4 className="mt-4 text-lg font-semibold">{o.city}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{o.addr}</p>
              <p className="mt-3 text-xs text-muted-foreground">{o.time}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
    </>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">{label}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder}
        className="glass w-full rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
