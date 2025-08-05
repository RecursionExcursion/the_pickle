"use client";

import { useEffect, useState } from "react";
import { Player } from "../service/types";
import { PlayerSelect } from "./PlayerSelect";
import MatchList from "./MatchList";
import { usePickleContext } from "../context/PickleContext";
import { useSearchParams } from "next/navigation";
import LinkButton from "./LinkButton";

export default function HeadToHead() {
  const { players, matches } = usePickleContext();

  const searchParams = useSearchParams();

  const [player1Id, setPlayer1Id] = useState<string | undefined>(() => {
    return searchParams.get("p1") ?? localStorage.getItem("h2h1") ?? undefined;
  });
  const [player2Id, setPlayer2Id] = useState<string | undefined>(() => {
    return searchParams.get("p2") ?? localStorage.getItem("h2h2") ?? undefined;
  });

  const [player1, setPlayer1] = useState<Player>();
  const [player2, setPlayer2] = useState<Player>();

  useEffect(() => {
    if (player1Id) {
      const p1 = players.find((p) => p.id === player1Id);
      setPlayer1(p1 ?? undefined);
      localStorage.setItem("h2h1", player1Id);
    }

    if (player2Id) {
      const p2 = players.find((p) => p.id === player2Id);
      setPlayer2(p2 ?? undefined);
      localStorage.setItem("h2h2", player2Id);
    }
  }, [player1Id, player2Id, players]);

  return (
    <div className="flex flex-col gap-4 px-6 flex-1 overflow-hidden">
      <LinkButton href={`/addMatch?p1=${player1Id}&p2=${player2Id}`}>
        Add Match
      </LinkButton>
      <div className="flex gap-1 w-full justify-center items-center">
        <PlayerSelect
          playerName={player1Id}
          setPlayerName={setPlayer1Id}
          playerList={players}
        />
        <span className="text-lg">vs</span>
        <PlayerSelect
          playerName={player2Id}
          setPlayerName={setPlayer2Id}
          playerList={players}
        />
      </div>
      <div className="flex gap-2 w-full justify-center">
        {player1 && player2 && (
          <MatchList player1={player1} player2={player2} matches={matches} />
        )}
      </div>
    </div>
  );
}
