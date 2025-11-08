import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getBoardGames, getPlayers } from "@/../lib/queries";

import GlobalDataProvider from "@/app/providers/GlobalDataProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trackerooni | Board Game Score Tracker",
  description:
    "Track scores and keep statistics for your favorite board games with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [boardGames, players] = await Promise.all([
    getBoardGames(),
    getPlayers(),
  ]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalDataProvider boardGames={boardGames} players={players}>
          {children}
        </GlobalDataProvider>

        {/* Font awesome */}
        <script
          src="https://kit.fontawesome.com/5ce6ff5a25.js"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
