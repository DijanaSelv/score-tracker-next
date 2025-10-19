import { get } from "http";
import { getSessionDetails } from "../lib/queries";

export async function SessionDetailsCard(session: {
  sessionid: number;
  date: string;
}) {
  const sessionDetails = await getSessionDetails(session.sessionid);
  const sessionDetailsOrdered = sessionDetails.sort(
    (a, b) => b.score - a.score
  );

  return (
    <div>
      <h2>Session Details</h2>
      <div>
        {sessionDetailsOrdered.map((item: { score: number; name: string }) => (
          <div key={`${session.sessionid}-${item.name}`} className="flex gap-4">
            <div> {item.name}</div>
            <div> {item.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
