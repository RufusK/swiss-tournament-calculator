import { generateFirstRound } from "./firstRound";
import type { calculatePairings, Result } from "../types/externalTypes";
import { generateOtherRound } from "./otherRounds";

export const calculateSwissPairings: calculatePairings = async (state) => {
  // Placeholder implementation
  // Actual Swiss pairing logic would go here

  const isFirstRound = state.matches.length == 0 && state.byes.length == 0;

  if (isFirstRound) {
    return generateFirstRound(state);
  }

  return await generateOtherRound(state);
};
