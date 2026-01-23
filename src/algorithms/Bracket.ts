import type { InternalPlayer } from "./InternalPlayer";

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
  }
}
