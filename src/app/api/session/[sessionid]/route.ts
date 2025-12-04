import { getSessionDetails } from "@/../lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ sessionid: string }> }
) {
  const { sessionid } = await context.params;

  if (Number.isNaN(sessionid)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  const session = await getSessionDetails(Number(sessionid));

  return new Response(JSON.stringify(session), {
    status: 200,
  });
}
