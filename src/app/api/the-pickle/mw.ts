import { NextRequest, NextResponse } from "next/server";
import { deleteSessionCookie, getSessionCookie } from "./cookieAuth";
import { verifyToken } from "./jwtAuth";

type Handler = (req: NextRequest) => Promise<NextResponse>;
type MW = (h: Handler) => Handler;

export const mw_pipe =
  (...middlewares: MW[]): MW =>
  (handler) =>
    middlewares.reduceRight((acc, mw) => mw(acc), handler);

const mw_jwt_auth: MW = (h: Handler) => {
  return async (r: NextRequest) => {
    const session = await getSessionCookie();

    if (!session) {
      // return NextResponse.redirect(new URL("/login", r.url));
      return new NextResponse(null, { status: 401 });
    }

    if (!verifyToken(session.value)) {
      await deleteSessionCookie();
      return new NextResponse(null, { status: 401 });
    }
    console.log("Made it past");

    return h(r);
  };
};

export const mw = [mw_jwt_auth];
