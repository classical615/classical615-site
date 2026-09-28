import { SiteHeader } from "../../components/SiteHeader";

export default function BingoPage() {
  return (
    <div className="min-h-screen bg-purple-pale font-body text-ink">
      <SiteHeader />

      <section className="bg-yellow border-b-4 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl leading-none">Classical 615 Bingo</h1>
          <p className="mt-4 text-lg sm:text-xl">Go to concerts. Mark your card. Win a prize package valued at over $1,000.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <div className="rounded-2xl bg-paper p-8 shadow-sm">
          <h2 className="font-display text-2xl mb-4">What it is</h2>
          <p className="leading-relaxed">Classical 615 Bingo is a season-long game from Classical 615 with a big, huge, exciting grand prize for one lucky winner. Your bingo card is filled with Nashville classical concerts. Go to a concert, mark off the square. Complete a row, column, or diagonal, and you are entered to win.</p>
        </div>

        <div className="rounded-2xl bg-paper p-8 shadow-sm">
          <h2 className="font-display text-2xl mb-4">Your bingo card</h2>
          <div className="rounded-xl border-2 border-dashed border-ink px-6 py-12 text-center font-semibold">Bingo card coming soon!</div>
        </div>

        <div className="rounded-2xl bg-paper p-8 shadow-sm">
          <h2 className="font-display text-2xl mb-4">How to play</h2>
          <ol className="list-decimal pl-6 space-y-3 leading-relaxed">
            <li>Get your bingo card at classical615.com/bingo.</li>
            <li>Attend concerts on the card between now and June 15, 2027.</li>
            <li>At each concert, take a selfie with something that shows you are there: the printed program, a poster in the lobby, or your ticket. It does not need to be fancy.</li>
            <li>Once you have completed a row, column, or diagonal, email your selfies from every concert in that line to <a href="mailto:bingo@classical615.com" className="font-semibold text-orange underline">bingo@classical615.com</a> in one message. Include your name and tell us which squares you are claiming.</li>
          </ol>
        </div>

        <div className="rounded-2xl bg-paper p-8 shadow-sm">
          <h2 className="font-display text-2xl mb-4">Deadline</h2>
          <p className="leading-relaxed">All submissions are due by <strong>June 15, 2027</strong>. Winners will be announced <strong>July 1, 2027</strong>.</p>
        </div>

        <div className="rounded-2xl bg-yellow p-8 shadow-sm">
          <h2 className="font-display text-2xl mb-2">Prizes</h2>
          <p className="mb-4 font-semibold">One winner takes it all. The full package is valued at over $1,000 and includes:</p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>7-concert Classical Series package from the Nashville Symphony</li>
            <li>Nashville Opera 3-show subscription for the 2027-2028 season</li>
            <li>Two tickets to a Nashville Ballet performance (any show except <em>The Nutcracker</em>)</li>
            <li>Two tickets to a Vocal Arts Nashville concert</li>
            <li>Belmont Orchestras T-shirt</li>
            <li>Middle Tennessee Sinfonietta merch</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-paper p-8 shadow-sm">
          <h2 className="font-display text-2xl mb-4">The fine print</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
            <li>Every verified bingo earns one entry into the drawing. The more bingos you complete, the more entries you have.</li>
            <li>One concert counts for one square, even if it could fit more than one.</li>
            <li>We reserve the right to confirm the winner&apos;s attendance with the participating ensembles.</li>
            <li>The winner will be drawn at random from all entries and announced July 1, 2027.</li>
            <li>Prizes are provided by the ensembles listed and are subject to their availability and terms.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
