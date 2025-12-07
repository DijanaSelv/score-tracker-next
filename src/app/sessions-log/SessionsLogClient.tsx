"use client";
import { useState } from "react";
import type {} from "@mui/x-charts/themeAugmentation";
import ChartsSection from "./ChartsSection";
import PopupModalWrapper from "../../../components/PopupModalWrapper";
import SessionInfoPopupContent from "../../../components/SessionInfoPopupContent";
import SortBy from "../../../components/SortBy";
import { useRouter } from "next/navigation";
import SecondaryButton from "../../../components/SecondaryButton";
import { formatDate } from "../../../lib/utils";

type SessionRow = {
  boardgamename: string;
  boardgameslug: string;
  date: string;
  sessionid: number;
  winner: string;
  winnerslug: string;
};

type FilterConditions = {
  boardGameNameFilter: string | null;
  dateFilter: string | null;
  winnerFilter: string | null;
};

type headerItem = {
  text: string;
  filterValues?: (string | number)[];
  filterKey?: keyof FilterConditions;
};

const SessionsLogClient = ({
  sessionsData,
}: {
  sessionsData: SessionRow[];
}) => {
  const [sortCondition, setSortCondition] = useState<string>("boardgamename");
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [filterConditions, setFilterConditions] = useState<FilterConditions>({
    boardGameNameFilter: null,
    dateFilter: null,
    winnerFilter: null,
  });
  type PlayerSession = {
    slug: string;
    name: string;
    score: number;
    position: number;
  };
  const router = useRouter();

  const [sessionData, setSessionData] = useState<{
    boardgamename: string | null;
    boardgameslug: string | null;
    playerSessions: PlayerSession[] | null;
    date: string | null;
  } | null>(null);

  const [deleteItemPopup, setDeleteItemPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    date: string | Date;
  } | null>(null);

  const deleteSessionHandler = async (id: number) => {
    await fetch(`/api/deleteSession/${id}`);
    router.refresh();
    setDeleteItemPopup(false);
    setItemToDelete(null);
  };

  // Custom styling for the chart using sx or direct SVG overrides
  const chartStyles = {
    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
      stroke: "#ffffff",
    },
    "& .MuiChartsAxis-bottom .MuiChartsAxis-tick": {
      stroke: "#ffffff",
    },
    "& .MuiChartsAxis-bottom text": {
      fill: "#ffffff",
      fontSize: 12,
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
      stroke: "#ffffff",
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-tick": {
      stroke: "#ffffff",
    },
    "& .MuiChartsAxis-left text": {
      fill: "#ffffff",
      fontSize: 12,
    },
    "& line[class*='MuiChartsAxis-grid']": {
      stroke: "rgba(255,255,255,0.2)",
      strokeDasharray: "4 2",
    },
  };
  const uniqueBoardGamesNames = new Set(
    sessionsData.map((item) => item.boardgamename)
  );
  const uniqueWinners = new Set(sessionsData.map((item) => item.winner));
  const uniqueDates = new Set(sessionsData.map((item) => item.date));

  const sortedSessionsData = [...sessionsData].sort((a, b) => {
    switch (sortCondition) {
      case "boardgamename":
        return a.boardgamename.localeCompare(b.boardgamename);
      case "winner":
        return a.winner.localeCompare(b.winner);
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  const orderedData = sortDescending
    ? sortedSessionsData
    : [...sortedSessionsData].reverse();

  const filterData = () => {
    let filterData = orderedData;
    if (filterConditions.boardGameNameFilter) {
      filterData = filterData.filter(
        (row) => row.boardgamename == filterConditions.boardGameNameFilter
      );
    }
    if (filterConditions.dateFilter) {
      filterData = filterData.filter(
        (row) => row.date == filterConditions.dateFilter
      );
    }
    if (filterConditions.winnerFilter) {
      filterData = filterData.filter(
        (row) => row.winner == filterConditions.winnerFilter
      );
    }

    return filterData;
  };

  const finalDataForDisplay = filterData();

  const tableHeaders: headerItem[] = [
    {
      text: "date",
      filterValues: Array.from(uniqueDates),
      filterKey: "dateFilter",
    },
    {
      text: "game",
      filterValues: Array.from(uniqueBoardGamesNames),
      filterKey: "boardGameNameFilter",
    },

    {
      text: "winner",
      filterValues: Array.from(uniqueWinners),
      filterKey: "winnerFilter",
    },
  ];

  /* here we calculate statistics on the frontent, compared to boardgame page where we get them from the backend */
  const findMostOcurringValues = <T extends string | number>(arr: T[]) => {
    const counts: Record<string, number> = {};
    for (const i of arr) {
      const key = String(i);
      counts[key] = (counts[key] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(counts));

    return {
      values: Object.keys(counts)
        .filter((key) => counts[key] === maxCount)
        .map((key) => key) as T[],
      ocurrence: maxCount,
    };
  };

  const mostOccuringGames = findMostOcurringValues(
    sessionsData.map((item) => item.boardgamename)
  );

  const playerThatWonMost = findMostOcurringValues(
    sessionsData.map((item) => item.winner)
  );

  /* See more button to open the session modal */
  const onClickSession = async (
    sessionid: number,
    date: string,
    boardgamename: string,
    boardgameslug: string
  ) => {
    const res = await fetch(`../api/session/${sessionid}`);
    const playerSessions = (await res.json()) as PlayerSession[];
    setSessionData({ boardgamename, boardgameslug, date, playerSessions });
  };

  return (
    <section>
      {/* Session Details Popup */}

      <PopupModalWrapper
        isOpen={!!sessionData}
        closeAndResetForm={() => setSessionData(null)}
      >
        {sessionData && <SessionInfoPopupContent sessionData={sessionData} />}
      </PopupModalWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT SIDE< TABLE */}
        <div className="lg:col-span-8 xl:col-span-7">
          <SortBy
            sortTerms={["date", "boardgamename", "winner"]}
            setSortTerm={setSortCondition}
            setSortDescending={setSortDescending}
            selectedSortTerm={sortCondition}
            sortDescendingValue={sortDescending}
          />

          {/* TABLE */}
          <div className=" ">
            <div className="grid grid-cols-7 bg-foreground/5 gap-4  py-1.5 font-medium px-2">
              {/* HEADERS THAT ALSO HAVE FILTERS */}
              {tableHeaders.map((header, i) => (
                <div
                  className="flex items-center gap-2 col-span-2 text-sm"
                  key={`header-${i}`}
                >
                  <h3>{header.text}</h3>

                  {header.filterValues && (
                    <>
                      <button className="cursor-pointer size-4 flex items-center justify-center group transition-class relative gap-0.5">
                        <i
                          className="fa-solid fa-filter text-[10px] group-hover:text-teal-700 transition-class "
                          aria-hidden="true"
                          aria-label="filter icon"
                        ></i>

                        <div className=" opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto absolute w-22 h-fit p-1.5 px-2 text-xs border top-full inset-0 bg-background shadow-md border-foreground/40 flex flex-col gap-0.5 transition-class  ">
                          {header.filterValues.map((value, i) => (
                            <div
                              key={`${header.filterKey}-filter-button-${i}`}
                              onClick={() =>
                                setFilterConditions((prev) => ({
                                  ...prev,
                                  [header.filterKey!]: value,
                                }))
                              }
                              className="hover:text-teal-700 transition-class cursor-pointer"
                            >
                              {typeof value === "string" &&
                              !isNaN(Date.parse(value))
                                ? new Date(value).toLocaleDateString("en-GB")
                                : value}
                            </div>
                          ))}
                        </div>
                      </button>
                      {filterConditions[header.filterKey!] && (
                        <button
                          className=" class flex items-center gap-0.5 text-[10px] cursor-pointer hover:text-red-500 transition-class"
                          key={`header-clear-filter-button-${i}`}
                          onClick={() =>
                            setFilterConditions((prev) => ({
                              ...prev,
                              [header.filterKey!]: null,
                            }))
                          }
                        >
                          <span className="line-clamp-1">
                            {typeof filterConditions[header.filterKey!] ===
                              "string" &&
                            !isNaN(
                              Date.parse(
                                filterConditions[header.filterKey!] as string
                              )
                            )
                              ? new Date(
                                  filterConditions[header.filterKey!] as string
                                ).toLocaleDateString("en-GB")
                              : filterConditions[header.filterKey!]}
                          </span>{" "}
                          <i className="fa-solid fa-xmark text-[9px]"></i>
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}

              <div></div>
            </div>
            {/* THE ROWS */}
            {finalDataForDisplay.map((row: SessionRow, i: number) => (
              <div
                className="grid grid-cols-7 w-full py-1.5 lg:py-2 border-y border-collapse hover:border-teal-700/20 hover:shadow-teal-700/10 hover:shadow-sm border-foreground/5 px-2 transition-class hover:bg-teal-700/3 gap-4 group"
                key={`playerrow-${i}`}
              >
                <div className="col-span-2">
                  {new Date(row.date).toLocaleDateString("en-GB")}
                </div>
                <a
                  className="block hover:text-danger transition-class col-span-2"
                  href={`/boardgame/${row.boardgameslug}`}
                >
                  {row.boardgamename}
                </a>
                <a
                  className="block hover:text-danger transition-class col-span-2"
                  href={`/players/${row.winnerslug}`}
                >
                  {row.winner}
                </a>

                <div className="flex items-center gap-3">
                  <button
                    className="block cursor-pointer hover:text-danger transition-class text-sm"
                    onClick={() =>
                      onClickSession(
                        row.sessionid,
                        new Date(row.date).toLocaleDateString("en-GB"),
                        row.boardgamename,
                        row.boardgameslug
                      )
                    }
                  >
                    see more
                  </button>

                  <button
                    className="opacity-0 group-hover:opacity-100 transition-class cursor-pointer text-foreground/60 hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setItemToDelete({
                        id: row.sessionid,
                        date: new Date(row.date),
                      });
                      setDeleteItemPopup(true);
                    }}
                  >
                    <i className="fa-solid fa-trash text-xs "></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE, STATISTICS */}
        <div className="lg:col-span-4 xl:col-span-5">
          <ChartsSection sessionsData={sessionsData} />
        </div>
      </div>

      <div className="flex items-center divide-x divide-foreground/10 *:pr-4 gap-4 mt-12">
        <div>
          <h4 className="pb-1 font-semibold">
            Most played game{mostOccuringGames.values.length > 1 && "s"}:{" "}
          </h4>
          <p>{mostOccuringGames.values.join(", ")}</p>
          <p className="text-sm">
            (played {mostOccuringGames.ocurrence} time
            {mostOccuringGames.ocurrence > 1 && "s"})
          </p>
        </div>
        {playerThatWonMost.values.length > 0 ? (
          <div>
            <h4 className="pb-1 font-semibold">G.O.A.T:</h4>
            <p>{playerThatWonMost.values.join(", ")}</p>
            <p>
              (won {playerThatWonMost.ocurrence} time
              {playerThatWonMost.ocurrence > 1 && "s"})
            </p>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Delete Session popup */}
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
              Are you sure you want to delete the session on{" "}
              <span className="font-semibold text-danger">
                {formatDate(itemToDelete.date)}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end w-fit ml-auto gap-3">
              <SecondaryButton
                onClickHandle={() => deleteSessionHandler(itemToDelete.id)}
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

export default SessionsLogClient;
