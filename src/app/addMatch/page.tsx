import MatchAdder from "../../components/MatchAdder";
import { PickleProvider } from "../../context/PickleContext";

export default function AddMatchPage() {
  return (
    <PickleProvider>
      <MatchAdder />
    </PickleProvider>
  );
}
