"use client";

import { useEffect, useState } from "react";
import { Player } from "../service/types";
import { PlayerSelect } from "./PlayerSelect";
import MatchList from "./MatchList";
import { usePickleContext } from "../context/PickleContext";

export default function HeadToHead() {
  const { players, matches } = usePickleContext();

  const [player1Id, setPlayer1Id] = useState<string>();
  const [player2Id, setPlayer2Id] = useState<string>();

  const [player1, setPlayer1] = useState<Player>();
  const [player2, setPlayer2] = useState<Player>();

  useEffect(() => {
    const lsId1 = localStorage.getItem("h2h1");
    const lsId2 = localStorage.getItem("h2h2");

    if (lsId1) {
      const p1 = players.find((p) => p.id === lsId1);
      setPlayer1(p1);
      setPlayer1Id(lsId1);
    }

    if (lsId2) {
      const p2 = players.find((p) => p.id === lsId2);
      setPlayer2(p2);
      setPlayer2Id(lsId2);
    }
  }, [players]);

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
    <div className="flex flex-col gap-3 justify-center items-center">
      <h2>Head To Head</h2>
      <div className="flex">
        <PlayerSelect
          playerName={player1Id}
          setPlayerName={setPlayer1Id}
          playerList={players}
        />
        <span>vs</span>
        <PlayerSelect
          playerName={player2Id}
          setPlayerName={setPlayer2Id}
          playerList={players}
        />
      </div>
      <div className="flex gap-2">
        {player1 && player2 && (
          <MatchList player1={player1} player2={player2} matches={matches} />
        )}
      </div>
    </div>
  );
}
//TODO have LS hold last selected H2H
