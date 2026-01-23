import { chunk, every, slice, split, take } from "lodash-es";
import { sortPlayersByScoreAndId } from "./utils";
import type { InternalPlayer } from "./internalTypes";

export class Bracket {
  // 3.1.1      M0 is the number of MDP(s) coming from the previous bracket. It may be zero.
  public readonly M0: number;

  // 3.1.2      MaxPairs is the maximum number of pairs that can be produced in the bracket under consideration (see [C6], Article 2.4.1).
  // Note:   MaxPairs is usually equal to the number of players divided by two and rounded downwards. However, if, for instance, M0 is greater than the number of resident players, MaxPairs is at most equal to the number of resident players.
  public readonly MaxPairs: number;

  // 3.1.3      M1 is the number of MDP(s) that are paired in the bracket.
  // Note:   M1 is usually equal to the number of MDPs coming from the previous bracket, which may be zero.
  // However, if, for instance, M0 is greater than the number of resident players, M1 is at most equal to the number of resident players.
  // M1 can never be greater than MaxPairs.
  public readonly M1: number = 0;

  public players: InternalPlayer[];

  constructor(
    public readonly residents: InternalPlayer[], // players that are initially put in this bracket/scoregroup by score
    public readonly downFloaters: InternalPlayer[], // players that were downfloated from the previous bracket
    public readonly maximumAchievableScore: number,
    public readonly isLastRound: boolean,
  ) {
    this.players = [...residents, ...downFloaters];
    this.M0 = downFloaters.length;

    if (this.M0 > residents.length) {
      this.MaxPairs = residents.length;
    } else {
      this.MaxPairs = Math.floor((residents.length + downFloaters.length) / 2);
    }

    this.M1 = Math.min(this.M0, this.MaxPairs);
  }

  public calculatePairings(): number {
    let s1: InternalPlayer[] = [];
    let s2: InternalPlayer[] = [];

    var sortedPlayers = sortPlayersByScoreAndId(this.players);
    var isHomogeneous = sortedPlayers.every(
      (player) => player.score === sortedPlayers[0]!.score,
    );

    if (isHomogeneous) {
      s1 = slice(sortedPlayers, 0, this.MaxPairs);
      s2 = slice(sortedPlayers, this.MaxPairs, sortedPlayers.length);
    } else {
      s1 = slice(sortedPlayers, 0, this.M1);
      s2 = slice(sortedPlayers, this.M1, sortedPlayers.length);
    }
    return 0;
  }
}
