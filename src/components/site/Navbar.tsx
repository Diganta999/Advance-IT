import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6",
          scrolled ? "glass-strong" : "glass"
        )}
      >
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="absolute inset-0 rounded-xl opacity-50 blur-md" style={{ background: "var(--gradient-primary)" }} />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Nebula<span className="text-gradient">Labs</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "oklch(1 0 0 / 8%)", border: "1px solid var(--glass-border)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="absolute inset-0 rounded-xl opacity-0 blur-lg transition-opacity group-hover:opacity-60"
              style={{ background: "var(--gradient-primary)" }} />
            <span className="relative">Get a quote</span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="glass flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-strong mx-auto mt-2 max-w-7xl rounded-2xl p-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.to
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-2 rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Get a quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
