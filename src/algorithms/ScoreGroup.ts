import { orderBy } from "lodash-es";
import type { PlayerId } from "../types/externalTypes";

export class ScoreGroups {
  private _scoreGroups: ScoreGroup[];

  constructor(playersWithScores: { id: PlayerId; score: number }[]) {
    this._scoreGroups = orderBy(
      createScoreGroups(
        playersWithScores.map(({ id, score }) => ({ id, score })),
      ),
      "score",
      "desc",
    );
  }

  getNextScoreGroup(): ScoreGroup | undefined {
    return this._scoreGroups.pop();
  }
}

export class ScoreGroup {
  constructor(
    public score: number,
    public players: PlayerId[],
  ) {}
}

export function createScoreGroups(
  playersWithScores: { id: PlayerId; score: number }[],
): ScoreGroup[] {
  const scoreMap = new Map<number, PlayerId[]>();
  playersWithScores.forEach(({ id, score }) => {
    if (!scoreMap.has(score)) {
      scoreMap.set(score, []);
    }
    scoreMap.get(score)!.push(id);
  });
  return Array.from(scoreMap.entries()).map(
    ([score, players]) => new ScoreGroup(score, players),
  );
}
