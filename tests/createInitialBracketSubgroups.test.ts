import { describe, it, expect } from "bun:test";
import { createInitialBracketSubgroups } from "../src/algorithms/createInitialBracketSubgroups";
import {
  ColorPreference,
  type InternalPlayer,
} from "../src/types/internalTypes";

describe("createInitialBracketSubgroups", () => {
  it("should create initial bracket subgroups", () => {
    const players: InternalPlayer[] = [
      {
        id: "1",
        colorPreference: ColorPreference.NONE,
        hadBye: false,
        opponents: ["2", "3"],
        score: 1,
      },
      {
        id: "2",
        colorPreference: ColorPreference.NONE,
        hadBye: false,
        opponents: ["1", "4"],
        score: 1,
      },
      {
        id: "3",
        colorPreference: ColorPreference.NONE,
        hadBye: false,
        opponents: ["4", "1"],
        score: 1,
      },
      {
        id: "4",
        colorPreference: ColorPreference.NONE,
        hadBye: false,
        opponents: ["3", "2"],
        score: 1,
      },
    ];

    const subgroups = createInitialBracketSubgroups(players, []);

    expect(subgroups.S1).toContain(players[0]!);
    expect(subgroups.S1).toContain(players[1]!);
    expect(subgroups.S2).toContain(players[2]!);
    expect(subgroups.S2).toContain(players[3]!);
  });
});
