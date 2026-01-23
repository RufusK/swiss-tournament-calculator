import { last, nth, orderBy } from "lodash-es";
import {
  type PlayerId,
  type Match,
  type Bye,
  MatchResult,
  Color,
} from "./externalTypes";
import { POINTS_PER_DRAW, POINTS_PER_WIN } from "../constants";
import { ColorPreference } from "./internalTypes";

export class InternalPlayer {
  public score = 0;
  public colorDifference = 0;
  public colorPreference = ColorPreference.NONE;
  private _playedMatches: Match[] = [];
  private _byes: Bye[] = [];

  constructor(public id: PlayerId) {}

  hadBye(): boolean {
    return this._byes.length > 0;
  }

  hadOpponentWithId(playerId: PlayerId): boolean {
    return this._playedMatches.some(
      (match) => match.white === playerId || match.black === playerId,
    );
  }

  hadOpponent(player: InternalPlayer): boolean {
    return this.hadOpponentWithId(player.id);
  }

  addMatch(match: Match) {
    this._playedMatches.push(match);
    orderBy(this._playedMatches, "round", "asc");

    this.calculatePoints(match);

    this.calculateColorDifference(match);

    this.calculateColorPreference();
  }

  private calculateColorDifference(match: Match) {
    if (match.white === this.id) {
      this.colorDifference += 1;
    } else if (match.black === this.id) {
      this.colorDifference -= 1;
    }
  }

  private calculatePoints(match: Match) {
    if (match.result === MatchResult.WHITE_WIN && match.white === this.id) {
      this.score += POINTS_PER_WIN;
    } else if (
      match.result === MatchResult.BLACK_WIN &&
      match.black === this.id
    ) {
      this.score += POINTS_PER_WIN;
    } else if (match.result === MatchResult.DRAW) {
      this.score += POINTS_PER_DRAW;
    }
  }

  addBye(bye: Bye) {
    this._byes.push(bye);
    this.score += 1;
  }

  calculateColorPreference() {
    const lastColor =
      last(this._playedMatches)?.white == this.id ? Color.WHITE : Color.BLACK;

    const secondLastColor =
      nth(this._playedMatches, -2)?.white == this.id
        ? Color.WHITE
        : Color.BLACK;

    if (
      this.colorDifference > 1 ||
      (lastColor == Color.WHITE && secondLastColor == Color.WHITE)
    ) {
      this.colorPreference = ColorPreference.ABSOLUTE_BLACK;
    }

    if (
      this.colorDifference < -1 ||
      (lastColor == Color.BLACK && secondLastColor == Color.BLACK)
    ) {
      this.colorPreference = ColorPreference.ABSOLUTE_WHITE;
    }

    if ((this.colorDifference = 1)) {
      this.colorPreference = ColorPreference.STRONG_BLACK;
      return;
    }

    if ((this.colorDifference = -1)) {
      this.colorPreference = ColorPreference.STRONG_WHITE;
      return;
    }

    if (lastColor == Color.BLACK) {
      this.colorPreference = ColorPreference.MILD_WHITE;
      return;
    }

    if (lastColor == Color.WHITE) {
      this.colorDifference == ColorPreference.MILD_BLACK;
    }
  }
}
