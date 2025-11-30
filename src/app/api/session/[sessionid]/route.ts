import { getSessionDetails } from "@/../lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionid: string } }
) {
  const id = Number(params.sessionid);

  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  const session = await getSessionDetails(id);

  return new Response(JSON.stringify(session), {
    status: 200,
  });
}
