import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Sparkles, Mail } from "lucide-react";

const COLS = [
  {
    title: "Services",
    links: [
      ["Web Development", "/services"],
      ["Mobile Apps", "/services"],
      ["Cloud & DevOps", "/services"],
      ["AI Solutions", "/services"],
      ["Cyber Security", "/services"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Projects", "/projects"],
      ["Pricing", "/pricing"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Case studies", "/projects"],
      ["Process", "/about"],
      ["FAQ", "/pricing"],
      ["Support", "/contact"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-32 px-3 pb-6 sm:px-6">
      <div className="glass mx-auto max-w-7xl rounded-3xl p-8 sm:p-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="text-lg font-semibold">Nebula<span className="text-gradient">Labs</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Engineering teams who ship pixel-perfect software, scalable cloud infrastructure, and AI products for category-defining companies.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="glass mt-6 flex items-center gap-2 rounded-xl p-1.5"
            >
              <Mail className="ml-2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 bg-transparent px-1 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Subscribe
              </button>
            </form>
          </div>

          {COLS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-sm font-semibold tracking-wide text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-wide">Follow</h4>
            <div className="mt-4 flex gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="glass flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/10">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} NebulaLabs Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
