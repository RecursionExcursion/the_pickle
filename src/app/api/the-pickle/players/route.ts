import { NextResponse } from "next/server";
import thePickle from "../the_pickle";
import { mw, mw_pipe } from "../mw";
import { Player } from "@/service/types";
import { ApiCache } from "../cache";

const playerCache = new ApiCache<Player[]>([]);

export const GET = mw_pipe(...mw)(async () => {
  if (playerCache.isValid()) {
    return NextResponse.json(playerCache.data, { status: 200 });
  }

  const res = await thePickle.player.get();

  if (res.ok()) {
    playerCache.set(res.payload!);
  }

  return NextResponse.json(res.payload, { status: 200 });
});
