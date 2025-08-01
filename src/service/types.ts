export type Player = {
  id: string;
  name: string;
  matches: string[];
};

export type Match = {
  id: string;
  date: number;
  score: Score[];
};

export type Score = {
  id: string;
  points: number;
};
