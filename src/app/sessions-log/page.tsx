"use server";
import type { Props } from "@/../lib/types";
import SessionsLogClient from "./SessionsLogClient";

import { getAllSessions } from "@/../lib/queries";
import NewSession from "../../../components/NewSession";

const SessionLogPage = async ({ params }: Props) => {
  const allSessions = await getAllSessions();

  type AllSessionRow = {
    date: Date | string | null;
    boardgamename: string;
    boardgameslug: string;
    winner: string;
    winnerslug: string;
    sessionid: number;
  };

  const sessionsData = (allSessions as AllSessionRow[]).map((item) => ({
    ...item,
    date:
      item.date instanceof Date ? item.date.toISOString() : String(item.date),
  }));

  console.log(sessionsData, "sessionsData");

  return (
    <div className="flex flex-col">
      {allSessions.length >= 1 && allSessions[0].date != null ? (
        <SessionsLogClient sessionsData={sessionsData} />
      ) : (
        <div className="">
          {" "}
          <p> You haven&apos;t played anything yet.</p>
          <NewSession />
        </div>
      )}
    </div>
  );
};

export default SessionLogPage;
