import PlayerView from "../../components/PlayerView";
import { PickleProvider } from "../../context/PickleContext";

export default function PlayersPage() {
  return (
    <PickleProvider>
      <PlayerView />
    </PickleProvider>
  );
}
