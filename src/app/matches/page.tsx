import MatchManager from "../../components/MatchManager";
import { PickleProvider } from "../../context/PickleContext";

export default function MatchesPage() {
  return (
    <PickleProvider>
      <MatchManager />
    </PickleProvider>
  );
}
