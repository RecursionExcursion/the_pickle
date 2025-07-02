"use client";

import { useEffect, useState } from "react";
import MatchAdder from "../components/MatchAdder";
import PlayerView from "../components/PlayerView";
import { getMatches, getPlayers } from "../service/pickleService";
import { Match, Player } from "../service/types";
import { emitter } from "../lib/eventEmiter";
import HeadToHead from "../components/HeadToHead";
import MatchManager from "../components/MatchManager";
import Logo from "../components/Logo";
import BurgerMenu from "../components/BurgerMenu";
import ServerNotice from "../components/ServerNotice";

export type View = "home" | "add" | "head" | "players" | "manage";

export default function Home() {
  const [p, setP] = useState<Player[]>();
  const [m, setM] = useState<Match[]>();
  const [view, setView] = useState<View>("home");

  useEffect(() => {
    const contentListener = () => {
      getPlayers().then((p) => setP(p));
      getMatches().then((p) => setM(p));
    };
    emitter.on("update", contentListener);
    // emitter.emit("update");

    const menuListener = (selection: View) => {
      setView(selection);
    };
    emitter.on("menu", menuListener);

    return () => {
      emitter.off("update", contentListener);
      emitter.off("menu", menuListener);
    };
  }, []);

  if (!p || !m) {
    return <ServerNotice />;
  }

  return (
    <div className="flex flex-col gap-5 p-4 h-screen">
      <div className="p-6">
        <BurgerMenu />
      </div>
      {view === "home" && <MainPageLogo />}
      {view === "add" && <MatchAdder players={p} />}
      {view === "head" && <HeadToHead players={p} matches={m} />}
      {view === "players" && <PlayerView players={p} matches={m} />}
      {view === "manage" && <MatchManager players={p} matches={m} />}
    </div>
  );
}

function MainPageLogo() {
  return (
    <div className="flex justify-center items-center gap-2 h-full mb-24">
      <div className="flex w-24 h-24 relative scale-x-[-1]">
        <Logo />
      </div>
      <span
        style={{ fontFamily: "var(--font-dancing-script)" }}
        className="text-6xl text-center"
      >
        THE PICKLE
      </span>
      <div className="flex w-24 h-24 relative">
        <Logo />
      </div>
    </div>
  );
}
