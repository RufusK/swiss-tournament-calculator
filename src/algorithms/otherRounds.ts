import type { Bye, calculatePairings, FloatInfo, Pairing } from "./types";

export const generateOtherRound: calculatePairings = (state) => {
  const { round, players } = state;

  if (round == 1) {
    throw new Error("This implementation doesnt support round 1.");
  }

  const pairings: Pairing[] = [];
  const byes: Bye[] = [];
  const floats: FloatInfo[] = [];

  return {
    pairings: [],
    byes: [],
    floats: [],
  };
};
