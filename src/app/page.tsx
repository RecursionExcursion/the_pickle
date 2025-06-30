"use client";

import { useEffect, useState } from "react";
import MatchAdder from "../components/MatchAdder";
import PlayerView from "../components/PlayerView";
import { getMatches, getPlayers } from "../service/pickleService";
import { Match, Player } from "../service/types";

export default function Home() {
  const [p, setP] = useState<Player[]>();
  const [m, setM] = useState<Match[]>();

  useEffect(() => {
    getPlayers().then((p) => setP(p));
    getMatches().then((p) => setM(p));
  }, []);

  if (!p || !m) {
    return <>Server is waking up please try again in a moment</>;
  }

  return (
    <div className="p-4">
      <MatchAdder players={p} />
      <PlayerView matches={m} players={p} />
    </div>
  );
}
