import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "./app/api/the-pickle/cookieAuth";

/* Defines which routes run the middleware */
export const config = {
  matcher: ["/", "/settings", "/form", "/login"],
};

export async function middleware(request: NextRequest) {
  //early exit on not path requests
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico") ||
    request.headers.get("accept")?.includes("image") ||
    request.method !== "GET"
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  const pathIsLogin = url.pathname === "/login";

  const sessionCookie = await getSessionCookie();

  if (sessionCookie) {
    //Redirect if session is valid and login page is being hit
    if (pathIsLogin) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    //Proceed with request
    return NextResponse.next();
  }
  console.log("Session Cookie not found");

  //Session is invalid below

  //Prevents redirect
  if (url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
