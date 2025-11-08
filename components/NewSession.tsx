"use client";
import { useRef, useState } from "react";
import { addSession } from "../lib/queries";
import { useRouter } from "next/navigation";
import { useGlobalData } from "@/app/context/GlobalDataContext";

const NewSession = ({
  defaultBoardGameSelected,
}: {
  defaultBoardGameSelected?: number | undefined;
}) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { players, boardGames } = useGlobalData();

  const [newSessionPopupOpen, setNewSessionPopupOpen] =
    useState<boolean>(false);

  /* UX states */
  const [error, setError] = useState<string | null>(null);
  const [addingSession, setAddingSession] = useState<boolean>(false);

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
    changes: Partial<(typeof playerScores)[0]>
  ) => {
    setPlayerScores((prev) =>
      prev.map((playerRow, i) =>
        i === index ? { ...playerRow, ...changes } : playerRow
      )
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
    setNewSessionPopupOpen(false);
    formRef.current?.reset();
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
      await addSession(boardgameid, date, playerScores);
      closeAndResetForm();
      router.refresh();
    } catch (err: any) {
      console.error("Error adding board game:", err);
      if (err?.message?.includes("duplicate key")) {
        setError("A board game with this name already exists.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    setAddingSession(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setNewSessionPopupOpen((prev) => !prev);
        }}
        className="cursor-pointer border border-slate-400  hover:border-teal-700 transition-class  text-sm  px-2 py-1 rounded-md hover:rounded-none"
      >
        + Add New Session
      </button>

      {newSessionPopupOpen && (
        <div
          onMouseDown={closeAndResetForm}
          className={
            "fixed inset-0 bg-foreground/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center"
          }
        >
          <div
            className="mx-auto my-auto bg-background p-4 modal-content"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Add New Session</h2>
            <form
              ref={formRef}
              className="flex flex-col gap-3 min-w-xs new-game-form"
              onSubmit={submitSession}
            >
              <div className="flex flex-col ">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  required
                  id="date"
                  name="date"
                  className="border px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="boardgame">Board Game</label>
                <select
                  required
                  id="boardgame"
                  name="boardgame"
                  className="border px-2 py-1.5 outline-none focus:border-teal-700 transition-class"
                  defaultValue={defaultBoardGameSelected}
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
              <div className=" pb-4 ">
                <h3>Кој дешкаше?</h3>
                <div className="flex flex-col gap-2">
                  {playerScores.map((item, i) => (
                    <div
                      key={`playerdiv-${i}`}
                      className="flex items-center gap-2"
                    >
                      {/* EXISTING PLAYERS from the dropdown */}
                      {!item.player.isNew && (
                        <>
                          <select
                            id={`playerName-${i}`}
                            className="outline-none border px-2 py-0.5 flex-1"
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
                                  player.playerid === item.player.id ||
                                  !playerScores.some(
                                    (entry) =>
                                      entry.player.id == player.playerid
                                  )
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
                        </>
                      )}

                      {/* THIS SHOWS INPUT FOR A NEW PLAYER TO BE ADDED */}
                      {item.player.isNew && (
                        <>
                          <input
                            id={`playerName-${i}`}
                            type="text"
                            value={item.player.name}
                            className="outline-none border px-2 py-0.5 flex-1"
                            onChange={(e) =>
                              updatePlayer(i, {
                                player: {
                                  ...item.player,
                                  name: e.target.value,
                                },
                              })
                            }
                          />
                        </>
                      )}

                      <input
                        type="number"
                        className="outline-none flex-1 border px-2 py-0.5"
                        id={`playerscore-${i}`}
                        placeholder="Add score..."
                        value={item.score || 0}
                        onChange={(e) =>
                          updatePlayer(i, {
                            score: Number(e.target.value) || undefined,
                          })
                        }
                      />
                      <button
                        className=" size-7 border flex items-center justify-center cursor-pointer hover:text-amber-700 hover:border-amber-700 transition-class"
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
                    className="border p-1 cursor-pointer rounded-sm border-slate-400 hover:border-teal-700 hover:rounded-none hover:shadow-sm hover:border-teal-700\20 flex items-baseline gap-1 justify-center"
                    aria-label="add a player to the session"
                  >
                    <span>Add more</span>
                    <i
                      className="fa-solid fa-plus text-xs"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="mt-2 cursor-pointer border  hover:border-teal-700 transition-class    px-2 py-1.5"
              >
                {addingSession ? "Adding..." : " Save Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewSession;
