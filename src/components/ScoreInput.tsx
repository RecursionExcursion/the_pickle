"use client";

type ScoreInputProps = {
  score: string;
  setScore: (n: string) => void;
};

export function ScoreInput(props: ScoreInputProps) {
  const { score, setScore } = props;
  return (
    <div className="flex text-xl items-center justify-around">
      <span>Score</span>
      <input
        className="bg-[var(--color-secondary)] text-[var(--text-color)] h-10 w-20 text-center rounded-md px-2 py-1"
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      ></input>
    </div>
  );
}
