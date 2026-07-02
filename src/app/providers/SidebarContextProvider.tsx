"use client";
import React, { useState } from "react";
import { SidebarContext } from "../context/SideBarContext";
import { SidebarState, SidebarMode, Payload } from "../../../lib/types";

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

  const openSidebar = (mode: SidebarMode, payload?: Payload) => {
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

  const setPayload = (payload?: Payload) => {
    setSidebar((prev) => ({
      isOpen: prev.isOpen,
      mode: prev.mode,
      payload,
    }));
  };

  return (
    <SidebarContext.Provider
      value={{ sidebar, openSidebar, closeSidebar, setMode, setPayload }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
