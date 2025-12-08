"use client";
import { BarChart } from "@mui/x-charts";
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

export default function ChartsSection() {
  /*   const highestScores = () => {
    const countedData: Record<string, number> = {};
    sessionsData.forEach((s) => true);
  }; */

  const highestScores = [5, 10, 15, 20, 25, 30, 35];
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* highest scores */}
      <div>
        {/* <BarChart
          loading={!highestScores}
          xAxis={[
            {
              id: "barCategories",
              data: highestScores,
              colorMap: { type: "ordinal", colors: colorPaletteDefault },
            },
          ]}
          series={[{ data: highestScores, barLabel: "value" }]}
          height={300}
        /> */}
        <h4 className="text-center">Highest Scores Per Player</h4>
      </div>
      {/* wins */}
      <div>
        {/* <BarChart
          loading={!highestScores}
          xAxis={[
            {
              id: "barCategories",
              data: highestScores,
              colorMap: { type: "ordinal", colors: colorPaletteDefault },
            },
          ]}
          series={[{ data: highestScores, barLabel: "value" }]}
          height={300}
        /> */}
        <h4 className="text-center">Wins Per Player</h4>
      </div>
    </div>
  );
}
