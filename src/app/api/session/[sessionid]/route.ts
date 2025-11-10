import { getSessionDetails } from "@/../lib/queries";

export async function GET(
  req: Request,
  { params }: { params: { sessionid: string } }
) {
  const session = await getSessionDetails(Number(params.sessionid));
  return new Response(JSON.stringify(session), { status: 200 });
}
