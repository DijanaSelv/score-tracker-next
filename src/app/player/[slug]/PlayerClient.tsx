"use client";
import { useState } from "react";
import PopupModalWrapper from "../../../../components/PopupModalWrapper";
import SessionInfoPopupContent from "../../../../components/SessionInfoPopupContent";
import SortBy from "../../../../components/SortBy";

type PlayerRow = {
  boardgamename: string;
  playername: string;
  position: number | null;
  score: number;
  date: string;
  sessionid: number;
  boardgameslug: string;
};

type FilterConditions = {
  boardGameNameFilter: string | null;
  dateFilter: string | null;
  positionFilter: number | null;
};

type headerItem = {
  text: string;
  filterValues?: (string | number)[];
  filterKey?: keyof FilterConditions;
};

const PlayerClient = ({ playerData }: { playerData: PlayerRow[] }) => {
  const [sortCondition, setSortCondition] = useState<string>("boardgamename");
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [filterConditions, setFilterConditions] = useState<FilterConditions>({
    boardGameNameFilter: null,
    dateFilter: null,
    positionFilter: null,
  });
  type PlayerSession = { slug: string; name: string; position: number; score: number };

  const [sessionData, setSessionData] = useState<{
    boardgamename: string | null;
    boardgameslug: string | null;
    playerSessions: PlayerSession[] | null;
    date: string | null;
  } | null>(null);

  const uniqueBoardGamesNames = new Set(
    playerData.map((item) => item.boardgamename)
  );
  const uniquePositions = new Set(playerData.map((item) => item.position));
  const uniqueDates = new Set(playerData.map((item) => item.date));

  const sortedPlayerData = [...playerData].sort((a, b) => {
    switch (sortCondition) {
      case "boardgamename":
        return a.boardgamename.localeCompare(b.boardgamename);
      case "position":
        return (a.position ?? -1) - (b.position ?? -1);
      case "score":
        return b.score - a.score;
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  const orderedData = sortDescending
    ? sortedPlayerData
    : [...sortedPlayerData].reverse();

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
    if (filterConditions.positionFilter) {
      filterData = filterData.filter(
        (row) => row.position == filterConditions.positionFilter
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
      text: "board game",
      filterValues: Array.from(uniqueBoardGamesNames),
      filterKey: "boardGameNameFilter",
    },
    {
      text: "score",
    },
    {
      text: "position",
      filterValues: Array.from(uniquePositions).filter((v) => v != null) as (string | number)[],
      filterKey: "positionFilter",
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
    playerData.map((item) => item.boardgamename)
  );

  const mostWonGame = (() => {
    const wonGames = playerData
      .filter((session) => session.position == 1)
      .map((session) => session.boardgamename);

    const mostWonGames = findMostOcurringValues(wonGames);

    return mostWonGames;
  })();

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

  console.log(sessionData);

  return (
    <section>
      {/* Session Details Popup */}

      <PopupModalWrapper
        isOpen={!!sessionData}
        closeAndResetForm={() => setSessionData(null)}
      >
        {sessionData && <SessionInfoPopupContent sessionData={sessionData} />}
      </PopupModalWrapper>

      <SortBy
        sortTerms={["date", "boardgamename", "score", "position"]}
        setSortTerm={setSortCondition}
        setSortDescending={setSortDescending}
        selectedSortTerm={sortCondition}
        sortDescendingValue={sortDescending}
      />

      <div className="mt-12 ">
        <div className="grid grid-cols-5 bg-foreground/5  py-1.5 font-medium px-2">
          {/* HEADERS THAT ALSO HAVE FILTERS */}
          {tableHeaders.map((header, i) => (
            <div className="flex items-center gap-2" key={`header-${i}`}>
              <h3>{header.text}</h3>

              {header.filterValues && (
                <>
                  <button className="cursor-pointer size-4 flex items-center justify-center group transition-class relative gap-0.5">
                    <i
                      className="fa-solid fa-filter text-xs group-hover:text-teal-700 transition-class"
                      aria-hidden="true"
                      aria-label="filter icon"
                    ></i>

                    <div className=" opacity-0 -translate-y-1 pointer-event-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto absolute w-fit h-fit p-1.5 px-2 text-xs border top-full inset-0 bg-background shadow-md border-foreground/40 flex flex-col gap-0.5 transition-class  ">
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
                      <span>
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
        {finalDataForDisplay.map((row: PlayerRow, i: number) => (
          <div
            className="grid grid-cols-5 w-full py-1 border-y border-collapse hover:border-teal-700/20 hover:shadow-teal-700/10 hover:shadow-sm border-foreground/5 px-2 transition-class hover:bg-teal-700/3"
            key={`playerrow-${i}`}
          >
            <div>{new Date(row.date).toLocaleDateString("en-GB")}</div>
            <a
              className="block hover:text-danger transition-class"
              href={`/boardgame/${row.boardgameslug}`}
            >
              {row.boardgamename}
            </a>
            <div>{row.score}</div>
            <div>{row.position}</div>
            <button
              className="block cursor-pointer hover:text-danger transition-class"
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
          </div>
        ))}
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
        {mostWonGame.values.length > 0 ? (
          <div>
            <h4 className="pb-1 font-semibold">What you&apos;re best at:</h4>
            <p>{mostWonGame.values.join(", ")}</p>
            <p>
              (won {mostWonGame.ocurrence} time
              {mostWonGame.ocurrence > 1 && "s"})
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default PlayerClient;
