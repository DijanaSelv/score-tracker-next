"use client";
import { useMemo, useState } from "react";
import { useGlobalData } from "@/app/context/GlobalDataContext";
import { formatDate } from "@/../lib/utils";
import SortBy from "@/../components/SortBy";
import PopupModalWrapper from "../../components/PopupModalWrapper";
import SecondaryButton from "../../components/SecondaryButton";
import { useRouter } from "next/navigation";

export default function BoardGamesList() {
  const [sortTerm, setSortTerm] = useState<string>("name");
  const router = useRouter();

  const { boardGames } = useGlobalData();

  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [deleteItemPopup, setDeleteItemPopup] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const sortedGames = useMemo(() => {
    const sorted = [...boardGames].sort((a, b) => {
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

    return sortDescending ? sorted : sorted.reverse();
  }, [sortTerm, boardGames, sortDescending]);

  console.log(sortedGames, "sorted games");

  const deleteBoardGame = async (id: number) => {
    const res = await fetch(`../api/deleteBoardGame/${id}`);
    router.refresh();
    setDeleteItemPopup(false);
    setItemToDelete(null);
  };
  return (
    <section>
      <SortBy
        sortTerms={["name", "last_played", "session_count"]}
        setSortTerm={setSortTerm}
        setSortDescending={setSortDescending}
        selectedSortTerm={sortTerm}
        sortDescendingValue={sortDescending}
      />

      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedGames.map(
          (game: {
            boardgameid: number;
            name: string;
            slug: string;
            session_count: number;
            last_played: Date;
          }) => (
            <a
              href={`/boardgame/${game.slug}`}
              key={game.boardgameid}
              className="flex flex-col justify-between border border-slate-400 p-4 hover:border-teal-700 rounded-sm hover:rounded-none hover:shadow-md card-neon-hover bg-background group"
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
              <div className="flex items-start justify-between gap-3">
                <h3 className="leading-[100%] font-semibold tracking-wide lg:text-2xl md:text-xl text-lg pb-2 group-hover:text-accent transition-class lg:min-h-16">
                  {game.name}
                </h3>

                <div className="flex items-start gap-2 lg:opacity-0 group-hover:opacity-100 transition-class">
                  <button
                    className="cursor-pointer transition-class hover:text-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
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
                        id: game.boardgameid,
                        name: game.name,
                      });
                      setDeleteItemPopup(true);
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-trash pt-1 text-sm"></i>{" "}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-400 w-full flex flex-col lg:flex-row max-lg:divide-y  lg:divide-x divide-slate-400 mt-8 group-hover:mt-2 transition-class">
                <div className="lg:px-4 flex flex-row justify-between lg:flex-col lg:justify-end lg:items-center max-lg:py-2 lg:pt-4 max-lg:gap-4">
                  <p className="xl:text-2xl lg:text-xl text-lg  leading-[100%]">
                    {game.session_count || 0}
                  </p>
                  <p className="transition-class lg:opacity-0 group-hover:opacity-100 text-xs lg:max-h-0 group-hover:max-h-4 ">
                    sessions
                  </p>
                </div>
                <div className="flex-1 lg:px-4 justify-between flex lg:flex-col lg:justify-end flex-row max-lg:pt-2 max-lg:gap-4">
                  <p className="xl:text-2xl lg:text-xl  text-base  leading-[100%]">
                    {game.last_played ? formatDate(game.last_played) : "-"}
                  </p>
                  <span className=" transition-class lg:opacity-0 group-hover:opacity-100 text-xs lg:max-h-0 group-hover:max-h-4  ">
                    last played
                  </span>
                </div>
              </div>
            </a>
          )
        )}
      </div>

      {/* POPUPS */}
      {/* DELETE GAME POPUP */}
      <PopupModalWrapper
        isOpen={deleteItemPopup}
        closeAndResetForm={() => setDeleteItemPopup(false)}
      >
        {itemToDelete && (
          <div className="flex flex-col gap-4 lg:gap-6">
            <h2 className="font-semibold lg:text-2xl md:text-xl text-base">
              Delete Game
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
                onClickHandle={() => deleteBoardGame(itemToDelete.id)}
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
}
