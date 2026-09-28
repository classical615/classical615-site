import Link from "next/link";

export default function BingoPage() {
  return (
    <main style={{ fontFamily: "Poppins, sans-serif", color: "#2C4031", background: "#F3E4FA", minHeight: "100vh" }}>
      <section style={{ background: "#D9CF43", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Bungee, sans-serif", fontSize: "3rem", margin: 0 }}>Classical Concert Bingo</h1>
        <p style={{ fontSize: "1.25rem", maxWidth: "640px", margin: "16px auto 0" }}>Go to concerts. Mark your card. Win a season of classical music.</p>
      </section>

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontFamily: "Bungee, sans-serif" }}>What it is</h2>
        <p>Classical Concert Bingo is a season-long game from Classical 615 and the Nashville Philharmonic. Your bingo card is filled with Nashville classical concerts. Go to a concert, mark off the square. Complete a row, column, or diagonal, and you are entered to win.</p>

        <h2 style={{ fontFamily: "Bungee, sans-serif" }}>Your bingo card</h2>
        <div style={{ background: "#ffffff", border: "2px dashed #2C4031", borderRadius: "12px", padding: "40px", textAlign: "center", margin: "16px 0" }}>
          <p style={{ margin: 0 }}>Bingo card coming soon!</p>
        </div>

        <h2 style={{ fontFamily: "Bungee, sans-serif" }}>How to play</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Grab your bingo card above.</li>
          <li>Attend concerts on the card between now and June 15, 2027.</li>
          <li>At each concert, take a selfie with something that shows you were there: the printed program, a poster in the lobby, or your ticket. It does not need to be fancy.</li>
          <li>Once you have completed a row, column, or diagonal, email your selfies from every concert in that line to <a href="mailto:bingo@classical615.com" style={{ color: "#D97A43", fontWeight: 600 }}>bingo@classical615.com</a> in one message. Include your name and tell us which squares you are claiming.</li>
        </ol>

        <h2 style={{ fontFamily: "Bungee, sans-serif" }}>Deadline</h2>
        <p>All submissions are due by <strong>June 15, 2027</strong>. The winner will be announced on <strong>July 1, 2027</strong>.</p>

        <h2 style={{ fontFamily: "Bungee, sans-serif" }}>The prize</h2>
        <p>One winner takes it all. The prize package includes:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>7-concert Classical Series package from the Nashville Symphony</li>
          <li>Nashville Opera 3-show subscription for the 2027–2028 season</li>
          <li>Two tickets to a Nashville Ballet performance (any show except <em>The Nutcracker</em>)</li>
          <li>Two tickets to a Vocal Arts Nashville concert</li>
          <li>Belmont Orchestras T-shirt</li>
          <li>Middle Tennessee Sinfonietta merch</li>
        </ul>

        <h2 style={{ fontFamily: "Bungee, sans-serif" }}>The fine print</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Every verified bingo earns one entry into the drawing. The more bingos you complete, the more entries you have.</li>
          <li>One concert counts for one square, even if it could fit more than one.</li>
          <li>It is on the honor system, but we reserve the right to confirm the winner's attendance with the participating ensembles.</li>
          <li>The winner will be drawn at random from all entries and announced July 1, 2027.</li>
          <li>Prizes are provided by the ensembles listed and are subject to their availability and terms.</li>
        </ul>

        <p style={{ marginTop: "40px" }}>Need help finding concerts? <Link href="/" style={{ color: "#D97A43", fontWeight: 600 }}>Browse the full Nashville classical calendar</Link>.</p>
      </section>
    </main>
  );
}
