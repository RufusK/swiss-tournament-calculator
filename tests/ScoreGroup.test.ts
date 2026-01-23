import { expect, describe, it } from "bun:test";
import { createScoreGroups, ScoreGroup } from "../src/algorithms/ScoreGroup";

describe("ScoreGroup", () => {
  it("should create a score group with the correct score and players", () => {
    const scoreGroups = createScoreGroups([
      { id: "player1", score: 1 },
      { id: "player2", score: 1 },
      { id: "player3", score: 0.5 },
      { id: "player4", score: 0 },
    ]);
    expect(scoreGroups).toEqual([
      new ScoreGroup(1, ["player1", "player2"]),
      new ScoreGroup(0.5, ["player3"]),
      new ScoreGroup(0, ["player4"]),
    ]);
  });
});
