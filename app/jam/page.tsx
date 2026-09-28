import { SiteHeader } from "../../components/SiteHeader";

export default function JamPage() {
  return (
    <div className="min-h-screen bg-purple-pale font-body text-ink">
      <SiteHeader />

      <section className="bg-yellow border-b-4 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl leading-none">Classical 615 Jam</h1>
          <p className="mt-4 text-lg sm:text-xl">Classical music, live, in Nashville bars.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl bg-paper p-8 shadow-sm text-center">
          <p className="font-semibold">Details coming soon.</p>
        </div>
      </section>
    </div>
  );
}
