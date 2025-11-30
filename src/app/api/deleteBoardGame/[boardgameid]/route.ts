import { deleteBoardGame } from "@/../lib/queries";

export async function GET(
  req: Request,
  { params }: { params: { boardgameid: number } }
) {
  const session = await deleteBoardGame(Number(params.boardgameid));
  return new Response(JSON.stringify(session), { status: 200 });
}
