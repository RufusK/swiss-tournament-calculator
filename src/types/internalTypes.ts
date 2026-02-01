import type { PlayerId } from "./externalTypes";

export interface InternalPlayer {
  id: PlayerId;
  score: number;
  matches: InternalMatch[];
}

export interface InternalMatch {
  round: number;
  opponentId: PlayerId | "0000";
  color: InternalMatchColor;
  result: InternalMatchResult;
}

export enum InternalMatchColor {
  WHITE = "w",
  BLACK = "b",
  NONE = "-",
}

export enum InternalMatchResult {
  FORFEIT_LOSS = "-",
  FORFEIT_WIN = "+",
  WIN = "1",
  DRAW = "=",
  LOSS = "0",
  HALF_POINT_BYE = "H",
  FULL_POINT_BYE = "F",
  PAIRING_ALLOCATED_BYE = "U",
  ZERO_POINT_BYE = "Z",
}
