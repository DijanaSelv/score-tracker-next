"use client";

import { createContext, useContext } from "react";

import { SidebarContextType } from "../../../lib/types";

export const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (context === null) {
    throw new Error(
      "useSidebarContext must be used within the sidebar provider",
    );
  }

  return context;
}
