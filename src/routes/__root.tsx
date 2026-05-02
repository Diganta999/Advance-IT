import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/Background";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the nebula</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has drifted out of orbit.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NebulaLabs — Premium IT & Software Engineering Studio" },
      { name: "description", content: "NebulaLabs builds enterprise-grade web, mobile, cloud and AI products for category-defining companies." },
      { name: "author", content: "NebulaLabs" },
      { property: "og:title", content: "NebulaLabs — Premium IT Studio" },
      { property: "og:description", content: "Web, mobile, cloud, AI and security engineering for ambitious teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <AmbientBackground />
        <Navbar />
        <main className="pt-24">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-center" theme="dark" />
      </div>
    </QueryClientProvider>
  );
}
