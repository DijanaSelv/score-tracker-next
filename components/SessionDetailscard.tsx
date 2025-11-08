import { get } from "http";
import { getSessionDetails } from "../lib/queries";
import type { Session } from "@/../lib/types";

export async function SessionDetailsCard(session: Session) {
  const sessionDetails = await getSessionDetails(session.sessionid);
  const sessionDetailsOrdered = sessionDetails.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );

  return (
    <div>
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
              className="grid grid-cols-3 gap-5"
            >
              <a
                href={`/player/${item.slug}`}
                className="transition-class hover:text-red-500"
              >
                {" "}
                {item.name}
              </a>
              <div> {item.score}</div>
              <div> {item.position}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
