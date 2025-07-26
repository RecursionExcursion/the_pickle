import { NextRequest, NextResponse } from "next/server";
import thePickle from "../the_pickle";
import { mw, mw_pipe } from "../mw";
import { Score } from "../../../../service/types";

export const POST = mw_pipe(...mw)(async (r: NextRequest) => {
  const { date = Date.now(), score } = (await r.json()) as {
    date?: number;
    score: Score[];
  };
  const success = await thePickle.matches.create(date, score);
  return NextResponse.json(success, { status: 200 });
});

export const GET = mw_pipe(...mw)(async () => {
  const matches = await thePickle.matches.get();
  return NextResponse.json(matches.data, { status: 200 });
});

export const DELETE = mw_pipe(...mw)(async (r: NextRequest) => {
  const { id } = (await r.json()) as {
    id: string;
  };

  if (!id) {
    return new NextResponse(null, { status: 400 });
  }

  const res = await thePickle.matches.delete(id);

  return new NextResponse(null, { status: res.status });
});
