"use client";
import { useState } from "react";

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
  filterValues?: any[];
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
  const [sessionData, setSessionData] = useState<{
    boardgamename: string | null;
    boardgameslug: string | null;
    sessions: any[] | null;
    date: string | null;
  } | null>(null);

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
      text: "board game",
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
  const findMostOcurringValues = (arr: any[]) => {
    const counts: Record<string, number> = {};
    for (const i of arr) {
      counts[i] = (counts[i] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(counts));

    return {
      values: Object.keys(counts)
        .filter((key) => counts[key] === maxCount)
        .map((key) => key),
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
    const sessions = await res.json();
    setSessionData({ boardgamename, boardgameslug, date, sessions });
  };

  return (
    <section>
      {/* Session Details Popup */}
      {sessionData && (
        <div
          onMouseDown={() => setSessionData(null)}
          className={
            "fixed inset-0 bg-foreground/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-999"
          }
        >
          <div
            className="mx-auto my-auto bg-background p-4 modal-content"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              {sessionData.boardgamename}
            </h2>
            <h2 className="text-lg font-semibold mb-4">{sessionData.date}</h2>
            <div className="min-w-96">
              <div className="flex flex-col gap-2">
                {sessionData.sessions?.map((session, i) => (
                  <div
                    className="grid grid-cols-3 gap-4"
                    key={`sessionplayer-${i}`}
                  >
                    <p>{session.name}</p>
                    <p>{session.score}</p>
                    <p>{session.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-5 divide-x divide-foreground/10 *:pr-5 mt-12 justify-end">
        <div>
          <label>Sort by:</label>
          <select
            value={sortCondition}
            className="cursor-pointer"
            onChange={(e) => setSortCondition(e.currentTarget.value as string)}
          >
            <option value="date">date</option>
            <option value="boardgamename">board game</option>
            <option value="winner">winner</option>
          </select>
        </div>
        <button
          onClick={() => setSortDescending((prev) => !prev)}
          className="cursor-pointer "
        >
          <i
            className={`fa-solid fa-arrow-down transition-class ${
              sortDescending ? "rotate-0" : "rotate-180"
            }`}
            aria-hidden="true"
            aria-label="descending/ascending button"
          ></i>
        </button>
      </div>

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
        {finalDataForDisplay.map((row: SessionRow, i: number) => (
          <div
            className="grid grid-cols-5 w-full py-1 border-y border-collapse hover:border-teal-700/20 hover:shadow-teal-700/10 hover:shadow-sm border-foreground/5 px-2 transition-class hover:bg-teal-700/3"
            key={`playerrow-${i}`}
          >
            <div>{new Date(row.date).toLocaleDateString("en-GB")}</div>
            <a className="block" href={`/boardgame/${row.boardgameslug}`}>
              {row.boardgamename}
            </a>
            <a className="block" href={`/player/${row.winnerslug}`}>
              {row.winner}
            </a>

            <button
              className="block cursor-pointer"
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
    </section>
  );
};

export default SessionsLogClient;
