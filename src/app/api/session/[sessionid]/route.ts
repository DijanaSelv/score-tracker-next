import { getSessionDetails } from "@/../lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ sessionid: string }> }
) {
  const { sesisonid } = await context.params;

  if (Number.isNaN(sesisonid)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  const session = await getSessionDetails(sesisonid);

  return new Response(JSON.stringify(session), {
    status: 200,
  });
}
