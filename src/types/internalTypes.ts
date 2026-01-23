import type { PlayerId } from "./externalTypes";

export enum ColorPreference {
  ABSOLUTE_WHITE = 3,
  ABSOLUTE_BLACK = -3,
  STRONG_WHITE = 2,
  STRONG_BLACK = -2,
  MILD_WHITE = 1,
  MILD_BLACK = -1,
  NONE = 0,
}

export interface InternalPlayer {
  id: PlayerId;
  score: number;
  colorDifference: number;
  colorPreference: ColorPreference;
  opponents: PlayerId[];
  hadBye: boolean;
}
