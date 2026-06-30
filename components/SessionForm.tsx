"use client";
import { useEffect, useRef, useState } from "react";
import { addSession } from "../lib/queries";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useGlobalData } from "@/app/context/GlobalDataContext";

const SessionForm = () => {
  const router = useRouter();
  const sessionFormRef = useRef<HTMLFormElement>(null);
  const { players, boardGames } = useGlobalData();
  const { slug } = useParams();

  const [noScoreBoardGame, setNoScoreBoardGame] = useState<boolean>(false);
  const [selectedGameId, setSelectedGameId] = useState<number | "">("");

  /* UX states */
  const [error, setError] = useState<string | null>(null);
  const [addingSession, setAddingSession] = useState<boolean>(false);

  /* if we're on a boardgame page, then that board game should be preselected */
  useEffect(() => {
    const game = boardGames.find((g) => g.slug === slug);

    if (game?.boardgameid) {
      setSelectedGameId(game.boardgameid);
    }
  }, [boardGames, slug]);
  /* Players and scores in player rows  */

  type PlayerInfo = {
    id: number | undefined;
    name: string;
    isNew: boolean;
  };

  type PlayerScore = {
    player: PlayerInfo;
    score: number | undefined;
  };

  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([
    {
      player: { id: undefined, name: "", isNew: false },
      score: undefined,
    },
  ]);

  // Pass the changes and update the player in playerScores
  const updatePlayer = (
    index: number,
    changes: Partial<(typeof playerScores)[0]>,
  ) => {
    setPlayerScores((prev) =>
      prev.map((playerRow, i) =>
        i === index ? { ...playerRow, ...changes } : playerRow,
      ),
    );
  };

  /* check if we're adding a new player or an existing one and update the playerscores */
  const handlePlayerChange = (index: number, value: string) => {
    if (value === "new-player") {
      updatePlayer(index, { player: { id: undefined, name: "", isNew: true } });
    } else {
      updatePlayer(index, {
        player: { id: Number(value), name: "", isNew: false },
      });
    }
  };

  const closeAndResetForm = () => {
    sessionFormRef.current?.reset();
    setPlayerScores([
      { player: { id: undefined, name: "", isNew: false }, score: 0 },
    ]);
    setError(null);
  };

  const removePlayerRow = (rowIndex: number) => {
    setPlayerScores((prev) => {
      const newScores = prev.toSpliced(rowIndex, 1);
      return newScores;
    });
  };

  const submitSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dateValue = formData.get("date");
    const boardgameid = Number(formData.get("boardgame"));

    if (
      typeof dateValue !== "string" ||
      !boardgameid ||
      (playerScores.length <= 1 && playerScores[0]?.player.id == undefined)
    ) {
      setError("You must fill all fields.");
      return;
    }
    const date = new Date(dateValue);

    try {
      setAddingSession(true);
      const normalizedScores = playerScores.map((ps) => {
        // Existing players must have an ID
        if (!ps.player.isNew && ps.player.id === undefined) {
          throw new Error("Existing player must have an ID");
        }

        return {
          score: ps.score ?? 0, // convert undefined → 0
          player: {
            id: ps.player.isNew ? 0 : ps.player.id!, // temporary 0 for new players
            isNew: ps.player.isNew,
            name: ps.player.name,
          },
        };
      });

      await addSession(boardgameid, date, normalizedScores);
      closeAndResetForm();
      router.refresh();
    } catch (err: unknown) {
      console.error("Error adding board game:", err);

      if (err instanceof Error) {
        if (err.message.includes("duplicate key")) {
          setError("A board game with this name already exists.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
    setAddingSession(false);
  };

  return (
    <form
      ref={sessionFormRef}
      className="flex flex-col gap-4"
      onSubmit={submitSession}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="date">date</label>
        <input
          type="date"
          required
          id="date"
          name="date"
          className="border border-slate-400 px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="boardgame">game</label>
        <select
          required
          id="boardgame"
          name="boardgame"
          className="border border-slate-400 px-2 py-1.5 outline-none focus:border-teal-700 transition-class cursor-pointer"
          value={selectedGameId}
          onChange={(e) => {
            const value = Number(e.target.value);
            setSelectedGameId(value);
            setNoScoreBoardGame(
              boardGames.find((bg) => bg.boardgameid == Number(e.target.value))
                ?.nopoints ?? false,
            );
          }}
        >
          <option value={undefined}>Choose...</option>
          {boardGames.map((game) => (
            <option
              value={game.boardgameid}
              key={`boardgame-${game.boardgameid}`}
            >
              {game.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 pb-4 max-h-96 overflow-y-auto">
        <h3>players and {noScoreBoardGame ? "winners" : "scores"}</h3>
        <div className="flex flex-col gap-2">
          {playerScores.map((item, i) => (
            <div
              key={`playerdiv-${i}`}
              className="grid grid-cols-10 gap-1.5 sm:gap-2 w-full items-stretch"
            >
              {/* EXISTING PLAYERS from the dropdown */}
              {!item.player.isNew && (
                <select
                  id={`playerName-${i}`}
                  className={`outline-none border border-slate-400 px-1 py-1 flex-1 h-[30px] cursor-pointer  ${noScoreBoardGame ? "col-span-8" : "col-span-6"}`}
                  onChange={(e) => {
                    const value =
                      e.target.value === "new-player"
                        ? "new-player"
                        : e.target.value;
                    handlePlayerChange(i, value);
                  }}
                  name={`player-${i}`}
                >
                  <option value="">Choose...</option>
                  {players
                    .filter(
                      (player) =>
                        /* this removes a player from the dropdown if it was already selected here or on other rows */
                        player.playerid == item.player.id ||
                        !playerScores.some(
                          (entry) => entry.player.id == player.playerid,
                        ),
                    )
                    .map((player) => (
                      <option
                        value={player.playerid}
                        key={`player-${player.playerid}`}
                      >
                        {player.name}
                      </option>
                    ))}
                  <option value="new-player" key="new-player">
                    New Player
                  </option>
                </select>
              )}

              {/* THIS SHOWS INPUT FOR A NEW PLAYER TO BE ADDED */}
              {item.player.isNew && (
                <input
                  id={`playerName-${i}`}
                  type="text"
                  value={item.player.name}
                  className={`outline-none border border-slate-400 px-2 py-0.5 ${noScoreBoardGame ? "col-span-8" : "col-span-6"}`}
                  onChange={(e) =>
                    updatePlayer(i, {
                      player: {
                        ...item.player,
                        name: e.target.value,
                      },
                    })
                  }
                />
              )}
              {noScoreBoardGame ? (
                <div className="flex items-center gap-4  justify-center">
                  <label className="h-full w-auto aspect-square mx-auto">
                    <input
                      type="checkbox"
                      id={`playerscore-${i}`}
                      className="peer appearance-none hidden"
                      onChange={(e) =>
                        updatePlayer(i, {
                          score: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                    <div className="smx-auto aspect-square h-full border border-stroke peer-focus:border-teal-700  peer-checked:text-accent text-transparent cursor-pointer transition-class flex items-center justify-center">
                      {" "}
                      <i className="fa-solid fa-check"></i>{" "}
                    </div>
                  </label>
                </div>
              ) : (
                <input
                  type="number"
                  className="outline-none col-span-3 border border-slate-400 px-2 py-0.5  "
                  id={`playerscore-${i}`}
                  placeholder="Add score..."
                  value={item.score || 0}
                  onChange={(e) =>
                    updatePlayer(i, {
                      score: Number(e.target.value) || undefined,
                    })
                  }
                />
              )}

              <button
                className="border w-full h-full  flex items-center border-slate-400 justify-center cursor-pointer hover:text-amber-700 hover:border-amber-700 transition-class text-sm sm:text-base"
                type="button"
                key={`delete-player-row-${i}`}
                onClick={() => removePlayerRow(Number(i))}
              >
                {" "}
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setPlayerScores((prev) => [
                ...prev,
                {
                  player: { id: undefined, isNew: false, name: "" },
                  score: 0,
                },
              ])
            }
            className="border p-1 cursor-pointer  border-slate-400 hover:rounded-none hover:shadow-sm hover:border-teal-700\20 flex items-baseline gap-1 justify-center transition-class text-xs  opacity-50 hover:opacity-100  w-fit ml-auto"
            aria-label="add a player to the session"
          >
            <span>add player</span>
            <i className="fa-solid fa-plus text-[8px]" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className=" cursor-pointer border border-slate-400 hover:border-teal-700 transition-class px-2 py-1.5"
      >
        {addingSession ? "Adding..." : " Save Session"}
      </button>
    </form>
  );
};

export default SessionForm;
