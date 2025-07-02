"use client";

type ScoreInputProps = {
  score: string;
  setScore: (n: string) => void;
};

export function ScoreInput(props: ScoreInputProps) {
  const { score, setScore } = props;
  return (
    <div className="flex gap-3">
      <span>Score</span>
      <input
        className="bg-white text-black"
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      ></input>
    </div>
  );
}
