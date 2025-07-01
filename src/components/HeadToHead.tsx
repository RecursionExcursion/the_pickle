"use client";

import { useEffect, useState } from "react";
import { Match, Player } from "../service/types";
import { PlayerSelect } from "./PlayerSelect";
import MatchList from "./MatchList";

type HeadToHeadProps = {
  players: Player[];
  matches: Match[];
};

export default function HeadToHead(props: HeadToHeadProps) {
  const { players, matches } = props;

  const [player1Id, setPlayer1Id] = useState(players[0].id);
  const [player2Id, setPlayer2Id] = useState(players[1].id);

  const [player1, setPlayer1] = useState<Player>();
  const [player2, setPlayer2] = useState<Player>();

  useEffect(() => {
    if (player1Id) {
      const p1 = players.find((p) => p.id === player1Id);
      setPlayer1(p1 ?? undefined);
    }

    if (player2Id) {
      const p2 = players.find((p) => p.id === player2Id);
      setPlayer2(p2 ?? undefined);
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