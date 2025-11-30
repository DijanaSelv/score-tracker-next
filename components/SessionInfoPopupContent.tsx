import Counter from "./Counter";

const SessionInfoPopupContent = ({
  sessionData,
}: {
  sessionData: {
    boardgamename: string | null;
    boardgameslug: string | null;
    playerSessions:
      | { slug: string; name: string; position: number; score: number }[]
      | null;
    date: string | null;
  };
}) => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h1 className="font-medium lg:text-2xl md:text-xl text-lg">
        Session Info
      </h1>
      <div className="flex flex-col gap-1/2 ">
        <div className="grid grid-cols-6 gap-2">
          <p className="col-span-2">Game:</p>
          <a
            className="block hover:text-danger transition-class"
            href={
              sessionData.boardgameslug
                ? `/boardgame/${sessionData.boardgameslug}`
                : "#"
            }
          >
            <h2 className="col-span-4 font-medium ">
              {sessionData.boardgamename}
            </h2>
          </a>
        </div>
        <div className="grid grid-cols-6 gap-2">
          <p className="col-span-2">Date:</p>
          <h2 className="col-span-4">{sessionData.date}</h2>
        </div>
      </div>
      <div className="min-w-96">
        <div className="grid grid-cols-3 gap-4 mb-2 pb-1 border-b border-slate-400 font-medium text-sm">
          <p className="">players</p>
          <p className="">points</p>
          <p className="">position</p>
        </div>
        <div className="flex flex-col gap-2">
          {sessionData.playerSessions?.map((player, i) => (
            <div className="grid grid-cols-3 gap-4" key={`sessionplayer-${i}`}>
              <a
                href={player.slug}
                className="hover:text-danger transition-class flex items-center gap-2"
              >
                {player.name}
                {player.position == 1 && (
                  <i className="fa-solid fa-crown text-yellow-600 text-xs"></i>
                )}
              </a>
              <Counter value={player.score} />
              <p>{player.position} </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionInfoPopupContent;
