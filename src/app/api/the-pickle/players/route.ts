import { NextResponse } from "next/server";
import thePickle from "../the_pickle";
import { mw, mw_pipe } from "../mw";
import { Player } from "@/service/types";

const oneDayInMs = 24 * 60 * 60 * 1000;

const cache :{
  date: number;
  data: Player[];
} = { date: 0, data: [] };

export const GET = mw_pipe(...mw)(async () => {
  if (cache.date + oneDayInMs > Date.now()) {
      return NextResponse.json(cache.data, { status: 200 });
    }

  console.log("Fetching Player Data");
  const players = await thePickle.player.get();

  if (players.data) {
    cache.date = Date.now();
    cache.data = players.data;
  }

  return NextResponse.json(players.data, { status: 200 });
});
