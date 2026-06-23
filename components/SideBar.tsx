"use client";
import PlayerForm from "./PlayerForm";
import SessionForm from "./SessionForm";
import GameForm from "./GameForm";
import { useSidebarContext } from "@/app/context/SideBarContext";

const SideBar = ({
  defaultBoardGameSelected,
}: {
  defaultBoardGameSelected?: number | undefined;
}) => {
  const { sidebar, closeSidebar, setMode } = useSidebarContext();

  return (
    <div
      className={`border-stroke/40  flex  min-h-dvh  min-w-96 shadow-highlight shadow-xl flex-col  gap-4 overflow-x-hidden overflow-y-auto border-r p-4 transition-all bg-background fixed top-0 right-0 z-10000 h-dvh w-fit border-l  ${
        sidebar.isOpen
          ? "translate-x-0 delay-100 visible"
          : "translate-x-full invisible"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="grid grid-cols-3 border-y border-l border-stroke flex-1">
          <button
            className={`button-neon-hover transition-all hover:bg-white hover:text-black py-1.5 px-3  flex items-center justify-center border-r border-stroke cursor-pointer ${sidebar.mode === "add-game" ? "bg-white text-black relative z-10" : ""}`}
            onClick={() => {
              setMode("add-game");
            }}
          >
            + Game
          </button>
          <button
            className={`button-neon-hover transition-all hover:bg-white hover:text-black py-1.5 px-3  flex items-center justify-center border-r border-stroke cursor-pointer ${sidebar.mode === "add-player" ? "bg-white text-black relative z-10" : ""}`}
            onClick={() => {
              setMode("add-player");
            }}
          >
            + Player
          </button>
          <button
            className={`button-neon-hover transition-all hover:bg-white hover:text-black py-1.5 px-3  flex items-center justify-center border-r border-stroke cursor-pointer ${sidebar.mode === "add-session" ? "bg-white text-black relative z-10" : ""}`}
            onClick={() => {
              setMode("add-session");
            }}
          >
            + Session
          </button>
        </div>

        <button
          className="ml-auto cursor-pointer hover:text-danger transition-class"
          onClick={() => {
            closeSidebar();
          }}
        >
          <i className="fa-regular fa-x text-lg "></i>
        </button>
      </div>

      <div className="flex flex-col gap-3 pt-4  divide-stroke/40 divide-y *:pb-3 ">
        {sidebar.mode == "add-game" && <GameForm />}

        {sidebar.mode == "add-player" && <PlayerForm />}

        {sidebar.mode == "add-session" && <SessionForm />}
      </div>
    </div>
  );
};

export default SideBar;
