"use client";

import React from "react";
import { GlobalDataContext } from "@/app/context/GlobalDataContext";
import type { Player, BoardGame } from "@/../lib/types";

type GlobalDataProviderProps = {
  boardGames: BoardGame[];
  players: Player[];
  children: React.ReactNode;
};

export default function GlobalDataProvider({
  boardGames,
  players,
  children,
}: GlobalDataProviderProps) {
  return (
    <GlobalDataContext.Provider value={{ boardGames, players }}>
      {children}
    </GlobalDataContext.Provider>
  );
}
