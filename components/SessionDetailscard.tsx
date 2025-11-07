import { get } from "http";
import { getSessionDetails } from "../lib/queries";

export async function SessionDetailsCard(session: {
  sessionid: number;
  date: string;
  position: number;
}) {
  const sessionDetails = await getSessionDetails(session.sessionid);
  const sessionDetailsOrdered = sessionDetails.sort(
    (a, b) => b.score - a.score
  );

  return (
    <div>
      <div className="max-w-60">
        {sessionDetailsOrdered.map(
          (item: { score: number; name: string; position: number }) => (
            <div
              key={`${session.sessionid}-${item.name}`}
              className="grid grid-cols-3 gap-5"
            >
              <div> {item.name}</div>
              <div> {item.score}</div>
              <div> {item.position}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
