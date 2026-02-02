import { describe, it, expect } from "bun:test";
import {
  type Player,
  type TournamentState,
  ByeMatchResult,
  MatchResult,
} from "../src/types/externalTypes";
import { calculateSwissPairings } from "../src";

function createPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
  }));
}

describe("generateSwissPairings - Other Round", () => {
  it("should generate pairings for third round with even number of players", async () => {
    const state: TournamentState = {
      players: createPlayers(6),
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

  it("should generate pairings for 2nd round with odd number of players", async () => {
    const state: TournamentState = {
      players: createPlayers(5),
      matches: [
        { white: 1, black: 2, result: MatchResult.WHITE_WIN, round: 1 },
        { white: 3, black: 4, result: MatchResult.WHITE_WIN, round: 1 },
      ],
      byes: [
        { player: 5, round: 1, result: ByeMatchResult.PAIRING_ALLOCATED_BYE },
      ],
      totalNumberOfRounds: 6,
    };

    const result = await calculateSwissPairings(state);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(1);
    expect(result.pairings).toEqual([
      { white: 1, black: 5 },
      { white: 3, black: 2 },
    ]);
    expect(result.byes).toEqual([{ player: 4 }]);
  });

  it("should generate pairings for 2nd round with odd number of players if one person leaves the tournament and gets Zero-Point-Bye", async () => {
    const state: TournamentState = {
      players: createPlayers(5),
      matches: [
        { white: 1, black: 2, result: MatchResult.WHITE_WIN, round: 1 },
        { white: 3, black: 4, result: MatchResult.WHITE_WIN, round: 1 },
      ],
      byes: [
        {
          player: 5,
          round: 1,
          result: ByeMatchResult.PAIRING_ALLOCATED_BYE,
        },
      ],
      totalNumberOfRounds: 6,
    };

    const result = await calculateSwissPairings(state);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(1);
    expect(result.pairings).toEqual([
      { white: 1, black: 5 },
      { white: 3, black: 2 },
    ]);
    expect(result.byes).toEqual([{ player: 4 }]);
  });
});
