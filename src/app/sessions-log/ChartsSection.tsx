"use client";
import { BarChart } from "@mui/x-charts";

import PlayerStatsChart from "./PlayerStatsChart";
import type { SessionRow } from "@/../lib/types";

const colorPaletteDefault = [
  "#495AFB",
  "#FFC758",
  "#F35865",
  "#30C8FF",
  "#44CE8D",
  "#F286B3",
  "#FF8C39",
  "#495AFB",
  "#FFC758",
  "#F35865",
  "#30C8FF",
  "#44CE8D",
  "#F286B3",
  "#FF8C39",
  "#495AFB",
  "#FFC758",
  "#F35865",
  "#30C8FF",
  "#44CE8D",
  "#F286B3",
  "#FF8C39",
];

const ChartsSection = ({ sessionsData }: { sessionsData: SessionRow[] }) => {
  /* Most played games for bar chart */
  const mostPlayedGames = (() => {
    const countedSessions: Record<string, number> = {};
    sessionsData.forEach((s) => {
      countedSessions[s.boardgamename] =
        (countedSessions[s.boardgamename] ?? 0) + 1;
    });
    const bgnames = Object.keys(countedSessions).sort(
      (a, b) => countedSessions[b] - countedSessions[a]
    );
    const counts = bgnames.map((name) => countedSessions[name]);
    return { bgnames, counts };
  })();

  return (
    <div className="flex flex-col gap-6">
      {/* Most Played Games Bar Chart */}
      <div>
        <BarChart
          loading={!mostPlayedGames.counts.length}
          xAxis={[
            {
              id: "barCategories",
              data: mostPlayedGames.bgnames,
              colorMap: { type: "ordinal", colors: colorPaletteDefault },
            },
          ]}
          series={[{ data: mostPlayedGames.counts, barLabel: "value" }]}
          height={300}
        />
        <h4 className="text-center">Highest Scores Per Player</h4>
      </div>

      {/* Player Stats Pie Chart */}
      <div>
        <PlayerStatsChart />
      </div>
    </div>
  );
};

export default ChartsSection;
