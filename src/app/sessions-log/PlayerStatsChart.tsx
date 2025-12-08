"use client";

import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";

interface PlayerStat {
  name: string;
  times_played: number;
  times_won: number;
}

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const colorPaletteDefault = [
  "#495AFB",
  "#FFC758",
  "#F35865",
  "#30C8FF",
  "#44CE8D",
  "#F286B3",
  "#FF8C39",
];

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const drawingArea = useDrawingArea();

  if (!drawingArea) return null; // wait until chart is ready

  const { width, height, left, top } = drawingArea;

  return (
    <text
      x={left + width / 2}
      y={top + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={20}
      fill="#fff" // force white
      style={{ pointerEvents: "none" }} // avoid interfering with hover
    >
      {children}
    </text>
  );
}

export default function PlayerStatsChart(): React.ReactElement {
  const [playerStats, setPlayerStats] = React.useState<PlayerStat[] | null>(
    null
  );

  React.useEffect(() => {
    const fetchPlayerStats = async () => {
      const res = await fetch("../api/playersStats");
      const data = await res.json();
      setPlayerStats(data);
    };
    fetchPlayerStats();
  }, []);

  if (!playerStats) return <div>Loading...</div>;

  const totalCount = playerStats.reduce(
    (acc, p) => acc + Number(p.times_played),
    0
  );

  // Outer layer = total times played
  const outerData: ChartDatum[] = playerStats.map((p, i) => ({
    id: p.name,
    label: p.name,
    value: p.times_played,
    percentage: totalCount === 0 ? 0 : (p.times_played / totalCount) * 100,
    color: colorPaletteDefault[i % colorPaletteDefault.length],
  }));

  // Inner layer = Won / Not Won per player
  const innerData: ChartDatum[] = playerStats.flatMap((p, i) => [
    {
      id: `${p.name}-Won`,
      label: "Won",
      value: p.times_won,
      percentage:
        p.times_played === 0 ? 0 : (p.times_won / p.times_played) * 100,
      color: colorPaletteDefault[i % colorPaletteDefault.length],
    },
    {
      id: `${p.name}-NotWon`,
      label: "Not Won",
      value: p.times_played - p.times_won,
      percentage:
        p.times_played === 0
          ? 0
          : ((p.times_played - p.times_won) / p.times_played) * 100,
      color: colorPaletteDefault[i % colorPaletteDefault.length] + "80", // 50% opacity
    },
  ]);

  const innerRadius = 50;
  const middleRadius = 120;

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", height: 400 }}>
        <PieChart
          height={400}
          series={[
            {
              data: outerData,
              innerRadius,
              outerRadius: middleRadius,
              arcLabel: (item) => `${item.id} (${item.value})`,
              valueFormatter: ({ value }) =>
                `${value}/${totalCount} (${((value / totalCount) * 100).toFixed(
                  0
                )}%) `,
              highlightScope: { fade: "global", highlight: "item" },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
            {
              data: innerData,
              innerRadius: middleRadius,
              outerRadius: middleRadius + 40,
              arcLabel: (item) => `(${(item as any).percentage.toFixed(0)}%)`,
              valueFormatter: ({ value, id }) => {
                if (typeof id !== "string") return ""; // early exit if not a string

                const playerName = id.split("-")[0];
                const playerTotal =
                  playerStats.find((p) => p.name === playerName)
                    ?.times_played || 0;

                const percentage =
                  playerTotal === 0
                    ? 0
                    : ((value / playerTotal) * 100).toFixed(0);

                return `${value}/${playerTotal} (${percentage}%)`;
              },
              arcLabelRadius: middleRadius + 20,
              highlightScope: { fade: "global", highlight: "item" },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontSize: "12px",
            },
          }}
          hideLegend
        >
          <PieCenterLabel>Players</PieCenterLabel>
        </PieChart>
      </Box>
    </Box>
  );
}
