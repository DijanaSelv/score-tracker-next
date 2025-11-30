import { deleteBoardGame } from "@/../lib/queries";
import { NextRequest } from "next/server";

// Next.js route params are strings; accept the standard Request signature
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ boardgameid: string }> }
) {
  const { id } = await context.params;
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id" }), {
      status: 400,
    });
  }

  try {
    await deleteBoardGame(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
