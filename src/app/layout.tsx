import type { Metadata } from "next";
import { Electrolize, Zen_Dots, Sansation } from "next/font/google";
import "./globals.css";
import { getBoardGames, getPlayers } from "@/../lib/queries";
import NavBar from "../../components/NavBar";

import GlobalDataProvider from "@/app/providers/GlobalDataProvider";

const electrolize = Electrolize({
  variable: "--font-electrolize",
  subsets: ["latin"],
  weight: "400",
});

const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  subsets: ["latin"],
  weight: "400",
});
const fontSans = Sansation({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dash | Board Game Score Tracker",
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
    <html
      lang="en"
      className={`${fontSans.variable} ${electrolize.variable}  ${zenDots.variable}`}
    >
      <GlobalDataProvider boardGames={boardGames} players={players}>
        <body className={`${electrolize.className} antialiased`}>
          <NavBar />
          <main className="py-22 lg:py-32 container mx-auto px-4 lg:px-6">
            {children}
          </main>

          {/* Font awesome */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-..."
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </body>
      </GlobalDataProvider>
    </html>
  );
}
