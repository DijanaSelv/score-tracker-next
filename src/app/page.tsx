import NewBoardGame from "../../components/NewBoardGame";

import BoardGamesList from "../../components/BoardGamesList";
import NewSession from "../../components/NewSession";
import NewPlayer from "../../components/NewPlayer";
import ExplorePlayers from "../../components/ExplorePlayers";

export default async function Home() {
  return (
    <div className="font-sans items-center justify-center min-h-screen p-8 flex">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <BoardGamesList />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <NewBoardGame />
          <NewSession />
          <NewPlayer />
          <ExplorePlayers />
          <a
            href="/sessions-log/"
            className="cursor-pointer border border-slate-400  hover:border-teal-700 transition-class  text-sm  px-2 py-1 rounded-md hover:rounded-none"
          >
            Sessions Log
          </a>
        </div>
      </main>
    </div>
  );
}
