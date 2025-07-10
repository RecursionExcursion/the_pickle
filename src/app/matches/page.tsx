import MatchManager from "../../components/MatchManager";
import PageTitle from "../../components/PageTitle";
import { PickleProvider } from "../../context/PickleContext";

export default function MatchesPage() {
  return (
    <PickleProvider>
      <PageTitle>Matches</PageTitle>
      <MatchManager />
    </PickleProvider>
  );
}
