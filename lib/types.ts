export type Player = {
  playerid: number;
  name: string;
  slug: string;
};

export type BoardGame = {
  boardgameid: number;
  name: string;
  slug: string;
  session_count: number;
  last_played: Date;
};

export type Session = {
  sessionid: number;
  date: string;
  position: number;
};

export type Props = {
  params: { slug: string };
};
