import MatchManager from "../../components/MatchManager";
import PageTitle from "../../components/PageTitle";
import { PickleProvider } from "../../context/PickleContext";

export default function MatchesPage() {
  return (
    <PickleProvider>
      <div className="flex flex-col justify-start gap-10 p-6 h-full">
        <PageTitle>Matches</PageTitle>
        <MatchManager />
      </div>
    </PickleProvider>
  );
}
