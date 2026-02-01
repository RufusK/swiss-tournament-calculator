import type {
  ResultBye,
  calculatePairings,
  ResultPairing,
} from "../types/externalTypes";
import { mapToInternalPlayers } from "./mapToInternalPlayers";

export const generateOtherRound: calculatePairings = (state) => {
  const {
    nextRound: round,
    matches: pastMatches,
    players: givenPlayers,
    byes: pastByes,
    totalNumberOfRounds,
  } = state;

  if (round == 1) {
    throw new Error("This implementation doesnt support round 1.");
  }

  const players = mapToInternalPlayers(givenPlayers, pastMatches, pastByes);

  // create pairings
  const pairings: ResultPairing[] = [];
  const byes: ResultBye[] = [];

  return {
    pairings: [],
    byes: [],
    roundNumber: round,
  };
};
