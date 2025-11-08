export type Player = {
  playerid: number;
  name: string;
};

export type BoardGame = {
  boardgameid: number;
  name: string;
  slug: string;
  session_count: number;
  last_played: Date;
};
