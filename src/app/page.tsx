"use client";

import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import MatchAdder from "../components/MatchAdder";
import PlayerView from "../components/PlayerView";
import { getMatches, getPlayers } from "../service/pickleService";
import { Match, Player } from "../service/types";
import { emitter } from "../lib/eventEmiter";
import HeadToHead from "../components/HeadToHead";
import MatchManager from "../components/MatchManager";

type View = "home" | "add" | "head" | "players" | "manage";

export default function Home() {
  const [p, setP] = useState<Player[]>();
  const [m, setM] = useState<Match[]>();
  const [view, setView] = useState<View>("home");

  useEffect(() => {
    const listener = () => {
      getPlayers().then((p) => setP(p));
      getMatches().then((p) => setM(p));
    };
    emitter.on("update", listener);
    emitter.emit("update");

    return () => {
      emitter.off("update", listener);
    };
  }, []);

  if (!p || !m) {
    return <>Server is waking up please try again in a moment</>;
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex justify-around">
        <MainMenuButton text="Add Match" onClick={() => setView("add")} />
        <MainMenuButton text="Head To Head" onClick={() => setView("head")} />
        <MainMenuButton
          text="View All Players"
          onClick={() => setView("players")}
        />{" "}
        <MainMenuButton
          text="Manage Matches"
          onClick={() => setView("manage")}
        />
      </div>
      {view === "home" && <div className="...">The PICKLE</div>}
      {view === "add" && <MatchAdder players={p} />}
      {view === "head" && <HeadToHead players={p} matches={m} />}
      {view === "players" && <PlayerView players={p} matches={m} />}
      {view === "manage" && <MatchManager players={p} matches={m} />}
    </div>
  );
}

type MainMenuButtonProps = ComponentPropsWithoutRef<"button"> & {
  text: string;
};

function MainMenuButton(props: MainMenuButtonProps) {
  const { text, ...rest } = props;
  return (
    <button
      className="border border-white rounded-md px-2 py-1 cursor-pointer"
      {...rest}
    >
      {text}
    </button>
  );
}
