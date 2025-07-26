"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Match, Player } from "../service/types";
import BurgerMenu from "../components/BurgerMenu";
import { routeLinks } from "../routes/routes";
import Spinner from "../components/Spinner";
import { getMatches, getPlayers } from "../service/pickleService";

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
  const [players, setPlayers] = useState<Player[]>();
  const [matches, setMatches] = useState<Match[]>();

  useEffect(() => {
    updateContent();
  }, []);

  async function updateContent() {
    const pRes = await getPlayers();
    setPlayers(pRes.payload);
    const mRes = await getMatches();
    setMatches(mRes.payload);
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
      <div className="flex flex-col gap-5 p-4 h-screen">
        <BurgerMenu links={routeLinks} />
        {props.children}
      </div>
    </PickleContext.Provider>
  );
};

export const usePickleContext = () => useContext(PickleContext);
