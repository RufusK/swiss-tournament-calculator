import { describe, it, expect } from "bun:test";
import type { TournamentState, Player } from "../src/algorithms/externalTypes";
import { generateFirstRound } from "../src/algorithms/firstRound";

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
      matches: [],
      byes: [],
      nextRound: 1,
    };

    const result = generateFirstRound(state);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(0);
    expect(result.floats).toHaveLength(0);
  });
});

describe("generateFirstRound - odd number of players", () => {
  it("assigns a bye to the lowest-rated player when all players are rated", () => {
    const players: Player[] = [
      {
        id: "1",
        elo: 1800,
      },
      {
        id: "2",
        elo: 1700,
      },
      {
        id: "3",
        elo: 1600,
      },
    ];

    const state: TournamentState = {
      nextRound: 1,
      players,
      matches: [],
      byes: [],
    };

    const result = generateFirstRound(state);

    expect(result.pairings).toHaveLength(1);
    expect(result.byes).toHaveLength(1);
    expect(result.floats).toHaveLength(0);

    const bye = result.byes[0];
    expect(bye?.player).toBe("3"); // lowest-rated
    expect(bye?.round).toBe(1);

    // ensure bye player is not paired
    const pairedPlayers = result.pairings.flatMap((p) => [p.white, p.black]);
    expect(pairedPlayers).not.toContain("3");
  });

  it("assigns a bye to an unrated player when unrated players exist", () => {
    const players: Player[] = [
      {
        id: "1",
        elo: 1800,
      },
      {
        id: "2",
        elo: 1700,
      },
      {
        id: "u1",
      }, // unrated
      {
        id: "3",
        elo: 1600,
      },
      {
        id: "4",
        elo: 1500,
      },
    ];

    const state: TournamentState = {
      nextRound: 1,
      players,
      matches: [],
      byes: [],
    };

    const result = generateFirstRound(state);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(1);
    expect(result.floats).toHaveLength(0);

    const bye = result.byes[0];

    // acceptable bye candidates:
    // - any unrated player
    // - OR the lowest-rated rated player
    const acceptableByePlayers = new Set(["u1", "4"]);
    expect(acceptableByePlayers.has(bye!.player)).toBe(true);

    const pairedPlayers = result.pairings.flatMap((p) => [p.white, p.black]);
    expect(pairedPlayers).not.toContain(bye!.player);
  });
});
