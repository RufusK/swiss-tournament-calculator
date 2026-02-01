import { generateFirstRound } from "./firstRound";
import type { calculatePairings, Result } from "../types/externalTypes";
import { generateOtherRound } from "./otherRounds";

export const calculateSwissPairings: calculatePairings = (state) => {
  // Placeholder implementation
  // Actual Swiss pairing logic would go here

  if (state.nextRound === 1) {
    return generateFirstRound(state);
  }

  return generateOtherRound(state);
};
