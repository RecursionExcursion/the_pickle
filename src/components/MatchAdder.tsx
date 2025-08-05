"use client";

import { useState } from "react";
import { Player } from "../service/types";
import { addMatch } from "../service/pickleService";
import { PlayerSelect } from "./PlayerSelect";
import { ScoreInput } from "./ScoreInput";
import { usePickleContext } from "../context/PickleContext";
import { useRouter, useSearchParams } from "next/navigation";
import LinkButton from "./LinkButton";
import Button from "./Button";

export default function MatchAdder() {
  const { players, updateContent } = usePickleContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const [player1, setPlayer1] = useState<string | undefined>(
    () => searchParams.get("p1") ?? localStorage.getItem("ma1") ?? undefined
  );
  const [score1, setScore1] = useState("0");
  const [player2, setPlayer2] = useState<string | undefined>(
    () => searchParams.get("p2") ?? localStorage.getItem("ma2") ?? undefined
  );
  const [score2, setScore2] = useState("0");

  const handleSubmit = async () => {
    if (!player1 || !player2) {
      return;
    }

    localStorage.setItem("ma1", player1);
    localStorage.setItem("ma2", player2);

    const addMatchRes = await addMatch([
      {
        id: player1,
        points: Number.parseInt(score1),
      },
      {
        id: player2,
        points: Number.parseInt(score2),
      },
    ]);

    if (addMatchRes.status === 401) {
      router.push("/login");
    }

    if (addMatchRes.ok) {
      alert("Match Submitted");
      await updateContent();
    } else {
      alert("Could not submit match");
    }

    //reset scores
    //leave players
    setScore1("0");
    setScore2("0");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
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
      <div className="flex w-[90%] gap-5">
        <Button onClick={handleSubmit}>Submit</Button>
        <LinkButton href={`/h2h?p1=${player1}&p2=${player2}`}>
          View H2H
        </LinkButton>
      </div>
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
    <div className="flex flex-col gap-3 w-full">
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
