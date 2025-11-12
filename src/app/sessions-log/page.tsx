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
    <div className="container mx-auto px-4 lg:px-6 flex flex-col justify-center pt-16">
      {allSessions.length ? (
        <>
          <h2 className="lg:text-2xl">Sessions Log</h2>

          {allSessions.length > 1 && allSessions[0].date != null ? (
            <SessionsLogClient sessionsData={sessionsData} />
          ) : (
            <div className="mt-12">
              {" "}
              <p> You haven't played anything yet.</p>
              <NewSession />
            </div>
          )}
        </>
      ) : (
        <div>No such player exist.</div>
      )}
    </div>
  );
};

export default SessionLogPage;
