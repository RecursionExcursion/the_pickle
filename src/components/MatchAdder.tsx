"use client";

import { useEffect, useState } from "react";
import { Player } from "../service/types";
import { addMatch } from "../service/pickleService";
import { emitter } from "../lib/eventEmiter";
import { PlayerSelect } from "./PlayerSelect";
import { ScoreInput } from "./ScoreInput";
import { usePickleContext } from "../context/PickleContext";

export default function MatchAdder() {
  const { players } = usePickleContext();

  const [player1, setPlayer1] = useState<string>();
  const [score1, setScore1] = useState("0");
  const [player2, setPlayer2] = useState<string>();
  const [score2, setScore2] = useState("0");

  useEffect(() => {
    const lsId1 = localStorage.getItem("ma1");
    const lsId2 = localStorage.getItem("ma2");

    if (lsId1) {
      // const p1 = players.find((p) => p.id === lsId1);
      setPlayer1(lsId1);
    }

    if (lsId2) {
      // const p2 = players.find((p) => p.id === lsId2);
      setPlayer2(lsId2);
    }
  }, []);

  const handleSubmit = async () => {
    if (!player1 || !player2) {
      return;
    }

    localStorage.setItem("ma1", player1);
    localStorage.setItem("ma2", player2);

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
    alert("Match Submitted");

    //reset inputs
    // setPlayer1("");
    setScore1("0");
    // setPlayer2("");
    setScore2("0");
  };

  //TODO
  function handleViewH2H() {}

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
      <button className="border border-white" onClick={handleSubmit}>
        Submit
      </button>
      <button className="border border-white" onClick={handleViewH2H}>
        View H2H
      </button>
    </div>
  );
}

type MatchStatsInputProps = {
  title: string;
  p: string | undefined;
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
