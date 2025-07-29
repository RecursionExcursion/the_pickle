import { NextResponse } from "next/server";
import thePickle from "../the-pickle";
import { authChain, mw_pipe } from "../mw";
import { Player } from "@/service/types";
import { ApiCache } from "../cache";

const playerCache = new ApiCache<Player[]>([]);

export const GET = mw_pipe(...authChain)(async () => {
  if (playerCache.isValid()) {
    return NextResponse.json(playerCache.get(), { status: 200 });
  }

  const res = await thePickle.player.get();

  if (res.ok()) {
    playerCache.set(res.payload);
  }

  return NextResponse.json(res.payload, { status: 200 });
});
