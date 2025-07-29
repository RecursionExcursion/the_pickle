import { NextRequest, NextResponse } from "next/server";
import thePickle from "../the-pickle";
import { authChain, mw_pipe } from "../mw";
import { deleteSessionCookie, setSessionCookie } from "../cookie-auth";

export const POST = mw_pipe()(async (r: NextRequest) => {
  const pl = (await r.json()) as {
    un: string;
    pw: string;
  };

  if (!pl.un || !pl.pw) {
    return new NextResponse(null, { status: 400 });
  }

  const tokenRes = await thePickle.login.login(pl.un, pl.pw);

  if (!tokenRes.payload) {
    return new NextResponse(null, { status: 401 });
  }

  await setSessionCookie(tokenRes.payload);
  return new NextResponse(null, { status: 200 });
});

export const DELETE = mw_pipe(...authChain)(async () => {
  await deleteSessionCookie();
  return new NextResponse(null, { status: 200 });
});
