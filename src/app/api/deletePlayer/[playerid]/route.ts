import { deletePlayer } from "@/../lib/queries";
import { NextRequest } from "next/server";

// Next.js route params are strings; accept the standard Request signature
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ playerid: string }> }
) {
  const { playerid } = await context.params;
  const id = Number(playerid);
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  try {
    await deletePlayer(Number(id));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
