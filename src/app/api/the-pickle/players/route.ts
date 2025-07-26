import { NextResponse } from "next/server";
import thePickle from "../the_pickle";
import { mw, mw_pipe } from "../mw";

export const GET = mw_pipe(...mw)(async () => {
  const players = await thePickle.player.get();
  return NextResponse.json(players.data, { status: 200 });
});
