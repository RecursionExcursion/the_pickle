"use client";

import { useState } from "react";
import { Player } from "../service/types";
import { addMatch } from "../service/pickleService";
import { emitter } from "../lib/eventEmiter";
import { PlayerSelect } from "./PlayerSelect";
import { ScoreInput } from "./ScoreInput";

type MatchAdderProps = {
  players: Player[];
};

export default function MatchAdder(props: MatchAdderProps) {
  const { players } = props;

  const [player1, setPlayer1] = useState("");
  const [score1, setScore1] = useState("0");
  const [player2, setPlayer2] = useState("");
  const [score2, setScore2] = useState("0");

  const handleSubmit = async () => {
    await addMatch([
      {
        id: player1,
        points: Number.parseInt(score1),
      },
      {
        id: player2,
        points: Number.parseInt(score2),
      },
    ]);
    emitter.emit("update");

    //reset inputs
    setPlayer1("");
    setScore1("0");
    setPlayer2("");
    setScore2("0");
  };

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex gap-3">
        <PlayerSelect
          title="Player 1"
          playerName={player1}
          setPlayerName={setPlayer1}
          playerList={players}
        />
        <ScoreInput score={score1} setScore={setScore1} />
      </div>
      <div className="flex gap-3">
        <PlayerSelect
          title="Player 2"
          playerName={player2}
          setPlayerName={setPlayer2}
          playerList={players}
        />
        <ScoreInput score={score2} setScore={setScore2} />
      </div>
      <button className="border border-white" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
