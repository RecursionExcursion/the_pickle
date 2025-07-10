import PageTitle from "../../components/PageTitle";
import PlayerView from "../../components/PlayerView";
import { PickleProvider } from "../../context/PickleContext";

export default function PlayersPage() {
  return (
    <PickleProvider>
      <PageTitle>Players</PageTitle>
      <PlayerView />
    </PickleProvider>
  );
}
