"use client";

import { useGlobalData } from "@/app/context/GlobalDataContext";

const PlayersClient = () => {
  const { players } = useGlobalData();
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 xl:col-span-7">
          {players.length ? (
            <div className="flex flex-col  divide-y divide-slate-400">
              {players.map((player) => (
                <a
                  key={`players/${player.slug}`}
                  href={`players/${player.slug}`}
                  className="hover:text-danger transition-class lg:text-lg text-base py-1 lg:py-2 pl-3 lg:pl-4 "
                >
                  {player.name}
                </a>
              ))}
            </div>
          ) : (
            <>
              <h2>There are no players added so far.</h2>
            </>
          )}
        </div>
        <div className="lg:col-span-4 xl:col-span-5 text-center pt-8">
          stats coming soon...
        </div>
      </div>
    </section>
  );
};

export default PlayersClient;
