export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center bg-sand px-6 text-center">
      <div>
        <p className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
          Trinity Garage Door Service
        </p>
        <h1 className="mt-4 font-heading text-4xl font-black uppercase leading-none text-ink sm:text-6xl">
          Next.js scaffold is live
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink/70">
          Phase 0 complete — Next 16, React 19, Tailwind 4, and the Cloudflare/OpenNext
          toolchain are wired up. The Bold Trade homepage port lands in Phase 1.
        </p>
      </div>
    </main>
  );
}
