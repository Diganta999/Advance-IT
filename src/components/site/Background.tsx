export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div
        className="absolute -top-40 -left-32 h-[40rem] w-[40rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 280 / 55%), transparent 60%)", animation: "blob 18s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.20 200 / 50%), transparent 60%)", animation: "blob 22s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[34rem] w-[34rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.60 0.25 305 / 50%), transparent 60%)", animation: "blob 26s ease-in-out infinite" }}
      />
    </div>
  );
}
