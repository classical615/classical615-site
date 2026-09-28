import { SiteHeader } from "../../components/SiteHeader";

const green = "#2C4031";
const yellow = "#D9CF43";
const purple = "#F3E4FA";
const orange = "#D97A43";

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  marginBottom: "28px",
  boxShadow: "0 2px 12px rgba(44, 64, 49, 0.08)",
};

const prizeCardStyle = {
  background: yellow,
  borderRadius: "16px",
  padding: "32px",
  marginBottom: "28px",
  boxShadow: "0 2px 12px rgba(44, 64, 49, 0.08)",
};

const headingStyle = {
  fontFamily: "Bungee, sans-serif",
  fontSize: "1.5rem",
  color: green,
  margin: "0 0 16px 0",
};

const placeholderStyle = {
  border: "2px dashed " + green,
  borderRadius: "12px",
  padding: "48px 20px",
  textAlign: "center" as const,
};

const listItemStyle = {
  marginBottom: "10px",
};

export default function BingoPage() {
  return (
    <div>
      <SiteHeader />
      <main style={{ fontFamily: "Poppins, sans-serif", color: green, background: purple, minHeight: "100vh", lineHeight: 1.7 }}>
        <section style={{ background: yellow, padding: "64px 20px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Bungee, sans-serif", fontSize: "3rem", margin: 0, lineHeight: 1.1 }}>Classical 615 Bingo</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "16px auto 0" }}>Go to concerts. Mark your card. Win a season of classical music.</p>
        </section>

        <section style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 20px 80px" }}>
          <div style={cardStyle}>
            <h2 style={headingStyle}>What it is</h2>
            <p style={{ margin: 0 }}>Classical 615 Bingo is a season-long game from Classical 615 with a big, huge, exciting grand prize for one lucky winner. Your bingo card is filled with Nashville classical concerts. Go to a concert, mark off the square. Complete a row, column, or diagonal, and you are entered to win.</p>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Your bingo card</h2>
            <div style={placeholderStyle}>
              <p style={{ margin: 0, fontWeight: 600 }}>Bingo card coming soon!</p>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>How to play</h2>
            <ol style={{ margin: 0, paddingLeft: "24px" }}>
              <li style={listItemStyle}>Get your bingo card at classical615.com/bingo.</li>
              <li style={listItemStyle}>Attend concerts on the card between now and June 15, 2027.</li>
              <li style={listItemStyle}>At each concert, take a selfie with something that shows you are there: the printed program, a poster in the lobby, or your ticket. It does not need to be fancy.</li>
              <li>Once you have completed a row, column, or diagonal, email your selfies from every concert in that line to <a href="mailto:bingo@classical615.com" style={{ color: orange, fontWeight: 600 }}>bingo@classical615.com</a> in one message. Include your name and tell us which squares you are claiming.</li>
            </ol>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Deadline</h2>
            <p style={{ margin: 0 }}>All submissions are due by <strong>June 15, 2027</strong>. Winners will be announced <strong>July 1, 2027</strong>.</p>
          </div>

          <div style={prizeCardStyle}>
            <h2 style={headingStyle}>Prizes</h2>
            <p style={{ marginTop: 0 }}>One winner takes it all. The prize package includes:</p>
            <ul style={{ margin: 0, paddingLeft: "24px" }}>
              <li style={listItemStyle}>7-concert Classical Series package from the Nashville Symphony</li>
              <li style={listItemStyle}>Nashville Opera 3-show subscription for the 2027-2028 season</li>
              <li style={listItemStyle}>Two tickets to a Nashville Ballet performance (any show except <em>The Nutcracker</em>)</li>
              <li style={listItemStyle}>Two tickets to a Vocal Arts Nashville concert</li>
              <li style={listItemStyle}>Belmont Orchestras T-shirt</li>
              <li>Middle Tennessee Sinfonietta merch</li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>The fine print</h2>
            <ul style={{ margin: 0, paddingLeft: "24px", fontSize: "0.95rem" }}>
              <li style={listItemStyle}>Every verified bingo earns one entry into the drawing. The more bingos you complete, the more entries you have.</li>
              <li style={listItemStyle}>One concert counts for one square, even if it could fit more than one.</li>
              <li style={listItemStyle}>We reserve the right to confirm the winner&apos;s attendance with the participating ensembles.</li>
              <li style={listItemStyle}>The winner will be drawn at random from all entries and announced July 1, 2027.</li>
              <li>Prizes are provided by the ensembles listed and are subject to their availability and terms.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
