import HeadToHead from "../../components/HeadToHead";
import { PickleProvider } from "../../context/PickleContext"

export default function H2HPage() {
  return (
    <PickleProvider>
      <HeadToHead />
    </PickleProvider>
  );
}
