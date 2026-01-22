import { describe, it, expect } from "vitest";
import {
  TournamentState,
  PairingConstraints,
  Player,
} from "../src/algorithms/types";
import { generateFirstRound } from "../src/algorithms/firstRound";

const constraints: PairingConstraints = {
  allowFloating: true,
  maxColorImbalance: 2,
  minimizeColorDifference: true,
  noRepeatOpponents: true,
};

describe("generateSwissPairings - First Round", () => {
  it("should generate pairings for first round with even number of players", () => {
    const state: TournamentState = {
      players: [
        {
          id: "1",
          elo: 1600,
          colorBalance: 0,
          score: 0,
          opponents: [],
          colors: [],
          hadBye: false,
        },
        {
          id: "2",
          elo: 1550,
          colorBalance: 0,
          score: 0,
          opponents: [],
          colors: [],
          hadBye: false,
        },
        {
          id: "3",
          elo: 1500,
          colorBalance: 0,
          score: 0,
          opponents: [],
          colors: [],
          hadBye: false,
        },
        {
          id: "4",
          elo: 1450,
          colorBalance: 0,
          score: 0,
          opponents: [],
          colors: [],
          hadBye: false,
        },
      ],
      pairings: [],
      byes: [],
      round: 1,
    };

    const result = generateFirstRound(state, constraints);

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
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
      {
        id: "2",
        elo: 1700,
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
      {
        id: "3",
        elo: 1600,
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
    ];

    const state: TournamentState = {
      round: 1,
      players,
      pairings: [],
      byes: [],
    };

    const result = generateFirstRound(state, constraints);

    expect(result.pairings).toHaveLength(1);
    expect(result.byes).toHaveLength(1);
    expect(result.floats).toHaveLength(0);

    const bye = result.byes[0];
    expect(bye.player).toBe("3"); // lowest-rated
    expect(bye.round).toBe(1);

    // ensure bye player is not paired
    const pairedPlayers = result.pairings.flatMap((p) => [p.white, p.black]);
    expect(pairedPlayers).not.toContain("3");
  });

  it("assigns a bye to an unrated player when unrated players exist", () => {
    const players: Player[] = [
      {
        id: "1",
        elo: 1800,
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
      {
        id: "2",
        elo: 1700,
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
      {
        id: "u1",
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      }, // unrated
      {
        id: "3",
        elo: 1600,
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
      {
        id: "4",
        elo: 1500,
        score: 0,
        opponents: [],
        colors: [],
        colorBalance: 0,
        hadBye: false,
      },
    ];

    const state: TournamentState = {
      round: 1,
      players,
      pairings: [],
      byes: [],
    };

    const result = generateFirstRound(state, constraints);

    expect(result.pairings).toHaveLength(2);
    expect(result.byes).toHaveLength(1);
    expect(result.floats).toHaveLength(0);

    const bye = result.byes[0];

    // acceptable bye candidates:
    // - any unrated player
    // - OR the lowest-rated rated player
    const acceptableByePlayers = new Set(["u1", "4"]);
    expect(acceptableByePlayers.has(bye.player)).toBe(true);

    const pairedPlayers = result.pairings.flatMap((p) => [p.white, p.black]);
    expect(pairedPlayers).not.toContain(bye.player);
  });
});
