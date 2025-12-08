import { getPlayersStatistics } from "@/../lib/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const data = await getPlayersStatistics();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
