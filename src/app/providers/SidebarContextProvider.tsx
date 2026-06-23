"use client";
import React, { useState } from "react";
import { SidebarContext } from "../context/SideBarContext";
import { SidebarState, SidebarMode } from "../../../lib/types";

type SidebarContextProviderProps = {
  children: React.ReactNode;
};

export default function SidebarContextProvider({
  children,
}: SidebarContextProviderProps) {
  const [sidebar, setSidebar] = useState<SidebarState>({
    isOpen: false,
    mode: null,
    payload: undefined,
  });

  const openSidebar = (
    mode: SidebarMode | "add-session",
    payload?: unknown,
  ) => {
    setSidebar({
      isOpen: true,
      mode,
      payload,
    });
  };

  const closeSidebar = () => {
    setSidebar({
      isOpen: false,
      mode: null,
      payload: undefined,
    });
  };

  const setMode = (mode: SidebarMode) => {
    setSidebar((prev) => {
      return {
        isOpen: prev.isOpen,
        mode,
        payload: prev.payload,
      };
    });
  };

  return (
    <SidebarContext.Provider
      value={{ sidebar, openSidebar, closeSidebar, setMode }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
