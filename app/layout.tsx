import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Classical 615", description: "test" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink font-body antialiased">{children}</body>
    </html>
  );
}
