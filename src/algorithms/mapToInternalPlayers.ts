import { orderBy, last, nth } from "lodash-es";
import { POINTS_PER_WIN, POINTS_PER_DRAW } from "../constants";
import {
  Color,
  MatchResult,
  type Bye,
  type Match,
  type Player,
  type PlayerId,
} from "./externalTypes";
import { ColorPreference, type InternalPlayer } from "./internalTypes";

export function mapToInternalPlayers(
  players: Player[],
  pastMatches: Match[],
  pastByes: Bye[],
): InternalPlayer[] {
  const p = players.map((player) => new CalculationPlayer(player.id));

  pastMatches.forEach((match) => {
    const player1 = p.find((player) => player.id === match.white);
    const player2 = p.find((player) => player.id === match.black);

    if (player1 && player2) {
      player1.addMatch(match);
      player2.addMatch(match);
    }
  });

  pastByes.forEach((bye) => {
    const player = p.find((player) => player.id === bye.player);
    if (player) {
      player.addBye(bye);
    }
  });

  return p.map((player) => {
    const internalPlayer: InternalPlayer = {
      id: player.id,
      score: player.score,
      colorDifference: player.colorDifference,
      colorPreference: player.getColorPreference(),
      opponents: player.getOpponents(),
      hadBye: player.hadBye(),
    };
    return internalPlayer;
  });
}

class CalculationPlayer {
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

  getColorPreference(): ColorPreference {
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
      return ColorPreference.ABSOLUTE_BLACK;
    }

    if (
      this.colorDifference < -1 ||
      (lastColor == Color.BLACK && secondLastColor == Color.BLACK)
    ) {
      return ColorPreference.ABSOLUTE_WHITE;
    }

    if ((this.colorDifference = 1)) {
      return ColorPreference.STRONG_BLACK;
    }

    if ((this.colorDifference = -1)) {
      return ColorPreference.STRONG_WHITE;
    }

    if (lastColor == Color.BLACK) {
      return ColorPreference.MILD_WHITE;
    }

    if (lastColor == Color.WHITE) {
      return ColorPreference.MILD_BLACK;
    }

    return ColorPreference.NONE;
  }

  getOpponents(): PlayerId[] {
    return this._playedMatches.map((match) =>
      match.white === this.id ? match.black : match.white,
    );
  }
}
