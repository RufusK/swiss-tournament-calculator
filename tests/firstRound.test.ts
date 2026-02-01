import { describe, it, expect } from "bun:test";
import type { TournamentState, Player } from "../src/types/externalTypes";
import { generateFirstRound } from "../src/algorithms/firstRound";

describe("generateSwissPairings - First Round", () => {
  it("should generate pairings for first round with even number of players", () => {
    const state: TournamentState = {
      players: [
        {
          id: 1,
          elo: 1600,
        },
        {
          id: 2,
          elo: 1550,
        },
        {
          id: 3,
          elo: 1500,
        },
        {
          id: 4,
          elo: 1450,
        },
      ],
      matches: [],
      byes: [],
      nextRound: 1,
      totalNumberOfRounds: 6,
    };

    const result = generateFirstRound(state);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(0);
  });
});

describe("generateFirstRound - odd number of players", () => {
  it("assigns a bye to the lowest-rated player when all players are rated", () => {
    const players: Player[] = [
      {
        id: 1,
        elo: 1800,
      },
      {
        id: 2,
        elo: 1700,
      },
      {
        id: 3,
        elo: 1600,
      },
    ];

    const state: TournamentState = {
      nextRound: 1,
      players,
      matches: [],
      byes: [],
      totalNumberOfRounds: 6,
    };

    const result = generateFirstRound(state);

    expect(result.pairings).toHaveLength(1);
    expect(result.byes).toHaveLength(1);

    const bye = result.byes[0];
    expect(bye?.player).toBe(3);

    // ensure bye player is not paired
    const pairedPlayers = result.pairings.flatMap((p) => [p.white, p.black]);
    expect(pairedPlayers).not.toContain("3");
  });
});
