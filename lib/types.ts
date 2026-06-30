export type Player = {
  playerid: number;
  name: string;
  slug: string;
  session_count: number;
  last_played: Date;
};

export type PlayerInfo = {
  id: number | undefined;
  name: string;
  isNew: boolean;
};

export type PlayerScore = {
  player: PlayerInfo;
  score: number | undefined;
};

export type BoardGame = {
  boardgameid: number;
  name: string;
  slug: string;
  session_count: number;
  last_played: Date;
  nopoints: boolean;
};

export type Session = {
  sessionid: number;
  date: string;
  position: number;
};

export type Props = {
  params: { slug: string };
};

export type SessionRow = {
  boardgamename: string;
  boardgameslug: string;
  date: Date | string | null;
  sessionid: number;
  winners: { name: string; slug: string }[] | [];
  nopoints: boolean;
};

export type SidebarMode =
  | "add-game"
  | "edit-game"
  | "add-player"
  | "edit-player"
  | "add-session"
  | "edit-session";

export type Payload = {
  player?: Player;
  session?: Session;
  game?: BoardGame;
};
export type SidebarState = {
  isOpen: boolean;
  mode: SidebarMode | null;
  payload?: Payload | undefined;
};

export type SidebarContextType = {
  sidebar: SidebarState;
  openSidebar: (mode: SidebarMode, payload?: Payload) => void;
  closeSidebar: () => void;
  setMode: (mode: SidebarMode) => void;
};
