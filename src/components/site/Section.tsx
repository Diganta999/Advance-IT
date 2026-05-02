import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  children, className, id,
}: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow, title, description, center = true,
}: { eyebrow?: string; title: ReactNode; description?: ReactNode; center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("mb-14 max-w-3xl", center && "mx-auto text-center")}
    >
      {eyebrow && (
        <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </motion.div>
  );
}

export function GlassCard({
  children, className, hover = true,
}: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={cn(
        "glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500",
        hover && "hover:-translate-y-1 hover:bg-white/[0.09] hover:shadow-[0_20px_60px_-15px_oklch(0.70_0.20_265/40%)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(400px circle at var(--x,50%) var(--y,0%), oklch(0.70 0.20 265 / 12%), transparent 40%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
