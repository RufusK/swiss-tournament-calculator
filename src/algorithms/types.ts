export type calculatePairings = (
  state: TournamentState,
  constraints: PairingConstraints
) => PairingResult;

export type PlayerId = string;
export type Score = number;
export enum Color {
  WHITE,
  BLACK,
  NONE,
}

export interface Player {
  id: PlayerId;
  elo?: number;
  score: number;
  opponents: PlayerId[]; // in order of rounds
  colors: Color[]; // parallel to opponents
  colorBalance: number; // white = +1, black = -1
  hadBye: boolean;
}

export interface TournamentState {
  round: number;
  players: Player[];
  pairings: Pairing[];
  byes: Bye[];
}

export interface PairingResult {
  pairings: Pairing[];
  byes: Bye[];
  floats: FloatInfo[];
}

export interface FloatInfo {
  player: PlayerId;
  fromScore: Score;
  toScore: Score;
  direction: "up" | "down";
}

export interface Pairing {
  white: PlayerId;
  black: PlayerId;
  round: number;
}

export interface Bye {
  player: PlayerId;
  round: number;
}

export interface ScoreGroup {
  score: Score;
  players: PlayerId[];
}

export interface PairingConstraints {
  noRepeatOpponents: boolean;
  maxColorImbalance: number; // usually 2
  minimizeColorDifference: boolean;
  allowFloating: boolean;
}
