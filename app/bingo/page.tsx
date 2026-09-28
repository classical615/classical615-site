import SiteHeader from "../../components/SiteHeader";

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

const headingStyle = {
  fontFamily: "Bungee, sans-serif",
  fontSize: "1.5rem",
  color: green,
  margin: "0 0 16px 0",
};

export default function BingoPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ fontFamily: "Poppins, sans-serif", color: green, background: purple, minHeight: "100vh", lineHeight: 1.7 }}>
        <section style={{ background: yellow, padding: "64px 20px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Bungee, sans-serif", fontSize: "3rem", margin: 0, lineHeight: 1.1 }}>Classical 615 Bingo</h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "16px auto 0" }}>Go to concerts. Mark your card. Win a season of classical music.</p>
        </section>

        <section style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 20px 80px" }}>
          <div style={cardStyle}>
            <h2 style={headingStyle}>What it is</h2>
            <p style={{ margin: 0 }}>Classical 615 Bingo is a season-long game from Classical 615 with a big, huge, exciting grand prize for one lucky winner. Your bingo card is filled with Nashville classical concerts. Go to a concert, mark off the square. Complete a row, column, or diagonal, and you're entered to win.</p>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Your bingo card</h2>
            <div style={{ border: `2px dashed ${green}`, borderRadius: "12px", padding: "48px 20px", textAlign: "center" }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Bingo card coming soon!</p>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>How to play</h2>
            <ol style={{ margin: 0, paddingLeft: "24px" }}>
              <li style={{ marginBottom: "12px" }}>Get your bingo card at classical615.com/bingo.</li>
              <li style={{ marginBottom: "12px" }}>Attend concerts on the card between now and June 15, 2027.</li>
              <li style={{ marginBottom: "12px" }}>At each concert, take a selfie with something that shows you're there — the printed program, a poster in the lobby, or your ticket. It doesn't need to be fancy.</li>
              <li>Once you've completed a row, column, or diagonal, email your selfies from every concert in that line to <a href="mailto:bingo@classical615.com" style={{ color: orange, fontWeight: 600 }}>bingo@classical615.com</a> in one message. Include your name and tell us which squares you're claiming.</li>
            </ol>
          </div>

          <div style={cardStyle}>
            <h2 style={headingStyle}>Deadline</h2>
