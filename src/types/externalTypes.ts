export type calculatePairings = (state: TournamentState) => PairingResult;

export type PlayerId = string;
export type Score = number;

export enum Color {
  WHITE,
  BLACK,
  NONE,
}

export enum MatchResult {
  WHITE_WIN,
  BLACK_WIN,
  DRAW,
}

export interface Player {
  id: PlayerId;
  elo?: number;
}

export interface TournamentState {
  nextRound: number;
  totalNumberOfRounds: number;
  players: Player[];
  matches: Match[];
  byes: Bye[];
}

export interface PairingResult {
  pairings: Match[];
  byes: Bye[];
  floats: FloatInfo[];
}

export interface FloatInfo {
  player: PlayerId;
  fromScore: Score;
  toScore: Score;
  direction: "up" | "down";
}

export interface Match {
  white: PlayerId;
  black: PlayerId;
  round: number;
  result?: MatchResult; // null if not finished
}

export interface Bye {
  player: PlayerId;
  round: number;
}
