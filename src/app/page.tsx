import MatchAdder from "../components/MatchAdder";
import PlayerView from "../components/PlayerView";
import { getMatches, getPlayers } from "../service/pickleService";

export default async function Home() {
  const players = await getPlayers();
  const matches = await getMatches();

  if (!players || !matches) {
    return <>Server is waking up please try again in a moment</>;
  }

  return (
    <div className="p-4">
      <MatchAdder players={players} />
      <PlayerView matches={matches} players={players} />
    </div>
  );
}
