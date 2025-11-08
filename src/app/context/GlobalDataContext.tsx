"use client";

import { createContext, useContext } from "react";
import type { Player, BoardGame } from "@/../lib/types";

export type GlobalData = {
  boardGames: BoardGame[];
  players: Player[];
};

export const GlobalDataContext = createContext<GlobalData>({
  boardGames: [],
  players: [],
});

export function useGlobalData() {
  return useContext(GlobalDataContext);
}
