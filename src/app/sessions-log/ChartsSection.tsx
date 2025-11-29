"use client";
import { BarChart } from "@mui/x-charts";
import type {} from "@mui/x-charts/themeAugmentation";

const colorPaletteDefault = [
  "#495AFB",
  "#FFC758",
  "#F35865",
  "#30C8FF",
  "#44CE8D",
  "#F286B3",
  "#FF8C39",
];
type SessionRow = {
  boardgamename: string;
  boardgameslug: string;
  date: string;
  sessionid: number;
  winner: string;
  winnerslug: string;
};

const ChartsSection = ({ sessionsData }: { sessionsData: SessionRow[] }) => {
  /* sorted games by number of sessions */

  /* Most played games */
  const mostPlayedGames = (() => {
    const countedSessions: Record<string, number> = {};
    sessionsData.forEach((session) => {
      countedSessions[session.boardgamename] =
        (countedSessions[session.boardgamename] ?? 0) + 1;
    });

    const bgnames = Object.keys(countedSessions).sort((a, b) =>
      a.localeCompare(b)
    );
    /* return the first 8 most played games */
    const counts = bgnames.map((name, i) => i < 8 && countedSessions[name]);

    return { bgnames, counts };
  })();

  return (
    <>
      <div>
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: [...mostPlayedGames.bgnames],

              colorMap: {
                type: "ordinal",
                colors: colorPaletteDefault,
              },
            },
          ]}
          series={[
            {
              data: [...mostPlayedGames.counts],
              barLabel: "value",
            },
          ]}
          height={300}
        />
        <h4 className="text-center">most played games</h4>
      </div>
    </>
  );
};

export default ChartsSection;
