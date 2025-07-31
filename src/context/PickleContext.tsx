"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Match, Player } from "../service/types";
import BurgerMenu from "../components/BurgerMenu";
import { routeLinks } from "../routes/routes";
import Spinner from "../components/Spinner";
import { getMatches, getPlayers } from "../service/pickleService";
import { useRouter } from "next/navigation";
import PickleBallAnimation from "../components/PickleBallAnimation";

type PickleContextState = {
  players: Player[];
  matches: Match[];
  updateContent: () => Promise<void>;
};

export const PickleContext = createContext<PickleContextState>({
  players: [],
  matches: [],
  updateContent: async () => {},
});

type PickleProviderProps = {
  children: React.ReactNode;
};

export const PickleProvider = (props: PickleProviderProps) => {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>();
  const [matches, setMatches] = useState<Match[]>();

  useEffect(() => {
    updateContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateContent() {
    const pRes = await getPlayers();
    const mRes = await getMatches();

    if (!mRes.ok || !pRes.ok) {
      router.push("/login");
      return;
    }

    setPlayers(await pRes.json());
    setMatches(await mRes.json());
  }

  if (!players || !matches) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PickleContext.Provider
      value={{
        players: players,
        matches: matches,
        updateContent,
      }}
    >
      <div className="flex flex-col gap-5 h-screen text-white">
        <PickleBallAnimation /> {/*absolutly pos  */}
        <BurgerMenu links={routeLinks} />
        {props.children}
      </div>
    </PickleContext.Provider>
  );
};

export const usePickleContext = () => useContext(PickleContext);
