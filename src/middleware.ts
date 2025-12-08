import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const auth = request.headers.get("authorization");

  const username = "me";
  const password = process.env.APP_PASSWORD;

  //we check if browser sent authorization header, if not we tell the browser to ask for credentials
  if (!auth) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  //we need to check if the browser sent the right type of auth
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic") {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  //after user puts credentials they are decoded
  const decoded = atob(encoded);
  const [user, pass] = decoded.split(":");

  //we check if they are valid
  if (user !== username || pass !== password) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  //we proceed to the page
  return NextResponse.next();
}

//this means all paths except _next and static files will be protected by the middleware
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
