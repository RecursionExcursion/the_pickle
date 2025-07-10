import MatchAdder from "../../components/MatchAdder";
import PageTitle from "../../components/PageTitle";
import { PickleProvider } from "../../context/PickleContext";

export default function AddMatchPage() {
  return (
    <PickleProvider>
       <PageTitle>Add Match</PageTitle>
      <MatchAdder />
    </PickleProvider>
  );
}
