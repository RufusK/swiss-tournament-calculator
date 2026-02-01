import { describe, it, expect } from "bun:test";
import { type TournamentState, MatchResult } from "../src/types/externalTypes";
import { calculateSwissPairings } from "../src";

describe("generateSwissPairings - First Round", () => {
  it("should generate pairings for first round with even number of players", async () => {
    const state: TournamentState = {
      players: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
        {
          id: 5,
        },
        {
          id: 6,
        },
      ],
      matches: [
        { white: 1, black: 2, result: MatchResult.WHITE_WIN, round: 1 },
        { white: 3, black: 4, result: MatchResult.BLACK_WIN, round: 1 },
        { white: 5, black: 6, result: MatchResult.DRAW, round: 1 },
        { white: 6, black: 1, result: MatchResult.BLACK_FORFEIT_WIN, round: 2 },
        { white: 4, black: 5, result: MatchResult.WHITE_FORFEIT_WIN, round: 2 },
        { white: 2, black: 3, result: MatchResult.DRAW, round: 2 },
      ],
      byes: [],
      totalNumberOfRounds: 6,
    };

    const result = await calculateSwissPairings(state);

    expect(result.pairings).toHaveLength(3);
    expect(result.byes).toHaveLength(0);
  });
});
