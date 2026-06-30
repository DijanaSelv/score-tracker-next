"use client";

import { useGlobalData } from "@/app/context/GlobalDataContext";
import { useState, useMemo } from "react";
import { formatDate } from "@/../lib/utils";
import PopupModalWrapper from "../../../components/PopupModalWrapper";
import SecondaryButton from "../../../components/SecondaryButton";
import { useRouter } from "next/navigation";
import SortBy from "../../../components/SortBy";
import { useSidebarContext } from "@/app/context/SideBarContext";

const PlayersClient = () => {
  const [deleteItemPopup, setDeleteItemPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [MobileExpandedView, setMobileExpandedView] = useState<boolean>(false);
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortTerm, setSortTerm] = useState<string>("session_count");

  const router = useRouter();
  const { openSidebar } = useSidebarContext();

  const { players } = useGlobalData();

  const displayedPlayers = useMemo(() => {
    const sorted = [...players].sort((a, b) => {
      if (sortTerm === "name") {
        return b.name.localeCompare(a.name);
      } else if (sortTerm === "last_played") {
        return (
          new Date(a.last_played).getTime() - new Date(b.last_played).getTime()
        );
      } else {
        return a.session_count - b.session_count;
      }
    });

    const ordered = sortDescending ? sorted : sorted.reverse();

    if (!searchTerm) return ordered;
    return ordered.filter((game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sortTerm, players, sortDescending, searchTerm]);

  const deletePlayerHandler = async (id: number) => {
    await fetch(`/api/deletePlayer/${id}`);
    router.refresh();
    setDeleteItemPopup(false);
    setItemToDelete(null);
  };

  return (
    <section>
      <div className="flex flex-row items-stretch gap-2 justify-between md:justify-end w-full md:mb-8 mb-6 max-md:flex-wrap">
        <div
          className={`rounded-sm border w-8 flex items-center justify-center md:hidden ${MobileExpandedView ? "border-accent text-accent" : "border-slate-400 "}`}
          onClick={() => setMobileExpandedView((prev) => !MobileExpandedView)}
        >
          <i className="fa-solid fa-arrows-up-down text-sm"></i>
        </div>

        <label
          htmlFor="search-input"
          className="border border-stroke rounded-sm outline-none px-2 py-1 flex items-center justify-between md:gap-3 gap-2 lg:gap-4 max-lg:flex-1 max-md:order-last max-md:basis-full max-md:w-full lg:min-w-80"
        >
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            <i className="fa-solid fa-magnifying-glass opacity-75"></i>
            <input
              name="search-input"
              id="search-input"
              className="outline-none border-none "
              onKeyDown={(e) => {
                if (e.key == "Escape") {
                  setSearchTerm("");
                }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
          </div>
          <button
            className={`transition-class text-xs hover:text-danger ${searchTerm == "" ? "opacity-0" : "opacity-75 cursor-pointer  hover:opacity-100"}`}
            onClick={() => setSearchTerm("")}
          >
            <i className="fa-solid fa-x "></i>
          </button>
        </label>

        <div className="">
          <SortBy
            sortTerms={["name", "last_played", "session_count"]}
            setSortTerm={setSortTerm}
            setSortDescending={setSortDescending}
            selectedSortTerm={sortTerm}
            sortDescendingValue={sortDescending}
          />
        </div>
      </div>

      {displayedPlayers.length ? (
        <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {displayedPlayers.map((player) => (
            <a
              href={`/players/${player.slug}`}
              key={player.playerid}
              className="flex flex-col justify-between border border-stroke p-2.5 sm:p-3 md:p-4 hover:border-teal-700 rounded-sm hover:rounded-none hover:shadow-md card-neon-hover  group bg-soft-dark"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                e.currentTarget.style.setProperty("--mx", `${x}px`);
                e.currentTarget.style.setProperty("--my", `${y}px`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty("--mx", `0px`);
                e.currentTarget.style.setProperty("--my", `0px`);
              }}
            >
              <div className="flex items-start lg:pb-2 justify-between gap-3">
                <h3 className="lg:font-semibold tracking-wide xl:text-2xl md:text-xl sm:text-lg text-base  group-hover:text-accent transition-class lg:min-h-8">
                  {player.name}
                </h3>

                <div className="flex items-start gap-2 lg:opacity-0 group-hover:opacity-100 transition-class">
                  <button
                    className="cursor-pointer transition-class hover:text-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      openSidebar("edit-player", { player });
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-pencil text-xs "></i>{" "}
                  </button>
                  <button
                    className="cursor-pointer transition-class hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setItemToDelete({
                        id: player.playerid,
                        name: player.name,
                      });
                      setDeleteItemPopup(true);
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-trash pt-1 text-xs md:text-sm"></i>{" "}
                  </button>
                </div>
              </div>

              <div
                className={`border-t border-stroke w-full flex flex-col lg:flex-row max-lg:divide-y lg:divide-x divide-slate-500 mt-8 group-hover:mt-2 transition-class ${MobileExpandedView ? "" : "max-md:hidden"}`}
              >
                <div className="lg:px-4 flex flex-row justify-between lg:flex-col lg:justify-end lg:items-center max-lg:py-2 lg:pt-4 max-lg:gap-4">
                  <p className=" text-sm sm:text-base md:text-lg  leading-[100%]">
                    {player.session_count || 0}
                  </p>
                  <p className="transition-class lg:opacity-0 group-hover:opacity-100 text-xs lg:max-h-0 group-hover:max-h-4 ">
                    sessions
                  </p>
                </div>
                <div className="flex-1 lg:px-4 justify-between flex lg:flex-col lg:justify-end flex-row max-lg:pt-2 max-lg:gap-4">
                  <p className="text-sm sm:text=base md:text-lg  leading-[100%]">
                    {player.last_played ? formatDate(player.last_played) : "-"}
                  </p>
                  <span className=" transition-class lg:opacity-0 group-hover:opacity-100 text-xs lg:max-h-0 group-hover:max-h-4  ">
                    last played
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <>
          <h2>There are no players added so far.</h2>
        </>
      )}

      {/*  <div className="lg:col-span-4 xl:col-span-5 text-center pt-8">
          stats coming soon...
        </div> */}

      {/* Delete Character popup */}
      <PopupModalWrapper
        isOpen={deleteItemPopup}
        closeAndResetForm={() => setDeleteItemPopup(false)}
      >
        {itemToDelete && (
          <div className="flex flex-col gap-4 lg:gap-6">
            <h2 className="font-semibold lg:text-2xl md:text-xl text-base">
              Delete Session
            </h2>
            <p className="text-balance pr-5 max-w-lg">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-danger">
                {itemToDelete.name}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end w-fit ml-auto gap-3">
              <SecondaryButton
                onClickHandle={() => deletePlayerHandler(itemToDelete.id)}
                danger={true}
              >
                Delete
              </SecondaryButton>
              <SecondaryButton onClickHandle={() => setDeleteItemPopup(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </div>
        )}
      </PopupModalWrapper>
    </section>
  );
};

export default PlayersClient;
