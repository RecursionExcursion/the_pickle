import HeadToHead from "../../components/HeadToHead";
import PageTitle from "../../components/PageTitle";
import { PickleProvider } from "../../context/PickleContext";

export default function H2HPage() {
  return (
    <PickleProvider>
      <PageTitle>Head to Head</PageTitle>
      <HeadToHead />
    </PickleProvider>
  );
}
