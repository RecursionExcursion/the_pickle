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
    alert("Match Submitted")

    //reset inputs
    setPlayer1("");
    setScore1("0");
    setPlayer2("");
    setScore2("0");
  };

  return (
    <div className="flex flex-col justify-center gap-5">
      <MatchStatsInput
        title="Player 1"
        p={player1}
        setP={setPlayer1}
        s={score1}
        setS={setScore1}
        players={players}
      />
      <MatchStatsInput
        title="Player 2"
        p={player2}
        setP={setPlayer2}
        s={score2}
        setS={setScore2}
        players={players}
      />
      {/* <div className="flex flex-col gap-3">
        <PlayerSelect
          title="Player 1"
          playerName={player1}
          setPlayerName={setPlayer1}
          playerList={players}
        />
        <ScoreInput score={score1} setScore={setScore1} />
      </div> */}
      {/* <div className="flex flex-col gap-3">
        <PlayerSelect
          title="Player 2"
          playerName={player2}
          setPlayerName={setPlayer2}
          playerList={players}
        />
        <ScoreInput score={score2} setScore={setScore2} />
      </div> */}
      <button className="border border-white" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

type MatchStatsInputProps = {
  title: string;
  p: string;
  setP: (s: string) => void;
  s: string;
  setS: (s: string) => void;
  players: Player[];
};

function MatchStatsInput(props: MatchStatsInputProps) {
  const { title, p, setP, s, setS, players } = props;
  return (
    <div className="flex flex-col gap-3">
      <PlayerSelect
        title={title}
        playerName={p}
        setPlayerName={setP}
        playerList={players}
      />
      <ScoreInput score={s} setScore={setS} />
    </div>
  );
}
