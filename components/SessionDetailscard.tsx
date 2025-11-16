import Counter from "@/../components/Counter";
import { getSessionDetails } from "../lib/queries";
import type { Session } from "@/../lib/types";
import { formatDate } from "../lib/utils";

export async function SessionDetailsCard(session: Session) {
  const sessionDetails = await getSessionDetails(session.sessionid);
  const sessionDetailsOrdered = sessionDetails.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );

  return (
    <div
      key={session.sessionid}
      className="p-4 border rounded-sm flex flex-col gap-2.5 md:gap-6 lg:gap-6 border-slate-400 hover:rounded-none hover:border-highlight transition-class card-static-hover"
    >
      <p className="font-medium text-lg"> {formatDate(session.date)}</p>
      <div className="max-w-60">
        {sessionDetailsOrdered.map(
          (item: {
            score: number;
            name: string;
            position: number;
            slug: string;
          }) => (
            <div
              key={`${session.sessionid}-${item.name}`}
              className="grid grid-cols-2 gap-2"
            >
              <a
                href={`/player/${item.slug}`}
                className="transition-class hover:text-red-500"
              >
                {" "}
                {item.name}
              </a>
              <div className="grid grid-cols-4 gap-1">
                <span className="col-span-1">
                  {" "}
                  {item.position == 1 && (
                    <i className="fa-solid fa-crown text-xs text-amber-400"></i>
                  )}
                </span>
                <p className="col-start-2 col-span-3">
                  {" "}
                  <Counter value={item.score} />
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
