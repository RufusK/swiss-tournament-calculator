export type calculatePairings = (state: TournamentState) => Promise<Result>;

export type PlayerId = number;

export enum Color {
  WHITE,
  BLACK,
  NONE,
}

export enum MatchResult {
  WHITE_WIN,
  BLACK_WIN,
  DRAW,
  WHITE_FORFEIT_WIN,
  BLACK_FORFEIT_WIN,
}

export enum ByeMatchResult {
  HALF_POINT_BYE,
  FULL_POINT_BYE,
  PAIRING_ALLOCATED_BYE,
  ZERO_POINT_BYE,
}

export interface Player {
  id: PlayerId;
  // currentRank: number;
}

export interface TournamentState {
  totalNumberOfRounds: number;
  players: Player[];
  matches: Match[];
  byes: Bye[];
}

export interface Match {
  white: PlayerId;
  black: PlayerId;
  round: number;
  result: MatchResult;
}

export interface Bye {
  player: PlayerId;
  round: number;
  result: ByeMatchResult;
}

// RESULT
export interface Result {
  pairings: ResultPairing[];
  byes: ResultBye[];
}

export interface ResultPairing {
  white: PlayerId;
  black: PlayerId;
}

export interface ResultBye {
  player: PlayerId;
}
