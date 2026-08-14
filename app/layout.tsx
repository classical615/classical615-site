import type { Metadata } from "next";
import { Bungee, Poppins, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// The chunky, offset-shadow block letters used in Classical 615's branding
// (the logo, the weekly graphics) — Bungee is the closest web font match.
const bungee = Bungee({
  subsets: ["latin"],
  variable: "--font-bungee",
  weight: "400",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plexmono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Classical 615 — Nashville's Classical Music Hub",
  description:
    "Every classical concert happening in Nashville, in one searchable calendar. Weekly events, ticket giveaways, and features from Classical 615.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bungee.variable} ${poppins.variable} ${plexMono.variable}`}>
      <body className="bg-paper text-ink font-body antialiased">{children}</body>
    </html>
  );
}
