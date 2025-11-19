"use server";
import type { Props } from "@/../lib/types";
import SessionsLogClient from "./SessionsLogClient";

import { getAllSessions } from "@/../lib/queries";
import NewSession from "../../../components/NewSession";

const SessionLogPage = async ({ params }: Props) => {
  const allSessions = await getAllSessions();

  const sessionsData = allSessions.map((item: any) => ({
    ...item,
    date: item.date.toISOString(),
  }));

  console.log(sessionsData, "sessionsData");

  return (
    <div className="flex flex-col">
      {allSessions.length > 1 && allSessions[0].date != null ? (
        <SessionsLogClient sessionsData={sessionsData} />
      ) : (
        <div className="">
          {" "}
          <p> You haven't played anything yet.</p>
          <NewSession />
        </div>
      )}
    </div>
  );
};

export default SessionLogPage;
