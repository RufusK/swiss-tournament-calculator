import { expect, describe, it } from "bun:test";

import { generateOtherRound } from "../src/algorithms/otherRounds";
import {
  MatchResult,
  type TournamentState,
} from "../src/algorithms/externalTypes";

describe("generateSwissPairings - First Round", () => {
  it("should generate pairings for first round with even number of players", () => {
    const state: TournamentState = {
      players: [
        {
          id: "1",
          elo: 1600,
        },
        {
          id: "2",
          elo: 1550,
        },
        {
          id: "3",
          elo: 1500,
        },
        {
          id: "4",
          elo: 1450,
        },
      ],
      matches: [
        {
          white: "1",
          black: "4",
          round: 1,
          result: MatchResult.WHITE_WIN,
        },
        {
          white: "2",
          black: "3",
          round: 1,
          result: MatchResult.WHITE_WIN,
        },
      ],
      byes: [],
      nextRound: 2,
    };

    const result = generateOtherRound(state);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(0);
    expect(result.floats).toHaveLength(0);
  });
});
