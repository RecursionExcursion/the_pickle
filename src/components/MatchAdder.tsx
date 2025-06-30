"use client";

import { useState } from "react";
import { Player } from "../service/types";
import { addMatch } from "../service/pickleService";

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
  };

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex gap-3">
        <span>Player 1</span>
        <select
          className="bg-white text-black"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        >
          <option value="">Select a player</option>
          {players.map((plyr) => (
            <option key={plyr.id} value={plyr.id}>
              {plyr.name}
            </option>
          ))}
        </select>
        <span>Score</span>
        <input
          className="bg-white text-black"
          type="number"
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
        ></input>
      </div>
      <div className="flex gap-3">
        <span>Player 2</span>
        <select
          className="bg-white text-black"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        >
          <option value="">Select a player</option>
          {players.map((plyr) => (
            <option key={plyr.id} value={plyr.id}>
              {plyr.name}
            </option>
          ))}
        </select>
        <span>Score</span>
        <input
          className="bg-white text-black"
          type="number"
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
        ></input>
      </div>
      <button className="border border-white" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
