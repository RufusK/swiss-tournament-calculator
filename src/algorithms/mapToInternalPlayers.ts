import { keyBy, each, orderBy } from "lodash-es";
import {
  MatchResult,
  type Match,
  type Player,
  type Bye,
  ByeMatchResult,
} from "../types/externalTypes";
import {
  InternalMatchColor,
  InternalMatchResult,
  type InternalMatch,
  type InternalPlayer,
} from "../types/internalTypes";

export function mapToInternalPlayers(
  originalPlayers: Player[],
  pastMatches: Match[],
  pastByes: Bye[],
): InternalPlayer[] {
  const internalPlayers = keyBy(
    originalPlayers.map(
      (player) =>
        ({
          id: player.id,
          score: 0,
          matches: [],
        }) as InternalPlayer,
    ),
    (p) => p.id,
  );

  pastMatches.forEach((match) => {
    const whitePlayer = internalPlayers[match.white];
    const blackPlayer = internalPlayers[match.black];

    if (whitePlayer && blackPlayer) {
      addMatch(whitePlayer, blackPlayer, match);
    }
  });

  pastByes.forEach((bye) => {
    const player = internalPlayers[bye.player];
    if (player) {
      addBye(player, bye);
    }
  });

  each(internalPlayers, (p) => {
    p.matches = orderBy(p.matches, (pl) => pl.round);
    p.score = calculatePlayerScore(p);
  });

  return Object.values(internalPlayers);
}

function addMatch(white: InternalPlayer, black: InternalPlayer, match: Match) {
  const whiteMatch: InternalMatch = {
    round: match.round,
    opponentId: black.id,
    result: InternalMatchResult.DRAW,
    color: InternalMatchColor.WHITE,
  };

  const blackMatch: InternalMatch = {
    round: match.round,
    opponentId: white.id,
    result: InternalMatchResult.DRAW,
    color: InternalMatchColor.BLACK,
  };

  switch (match.result) {
    case MatchResult.WHITE_WIN: {
      whiteMatch.result = InternalMatchResult.WIN;
      blackMatch.result = InternalMatchResult.LOSS;
      break;
    }

    case MatchResult.BLACK_WIN: {
      whiteMatch.result = InternalMatchResult.LOSS;
      blackMatch.result = InternalMatchResult.WIN;
      break;
    }

    case MatchResult.DRAW: {
      whiteMatch.result = InternalMatchResult.DRAW;
      blackMatch.result = InternalMatchResult.DRAW;
      break;
    }
    case MatchResult.WHITE_FORFEIT_WIN: {
      whiteMatch.result = InternalMatchResult.FORFEIT_WIN;
      whiteMatch.color = InternalMatchColor.NONE;
      blackMatch.result = InternalMatchResult.FORFEIT_LOSS;
      blackMatch.color = InternalMatchColor.NONE;
      break;
    }
    case MatchResult.BLACK_FORFEIT_WIN: {
      whiteMatch.result = InternalMatchResult.FORFEIT_LOSS;
      whiteMatch.color = InternalMatchColor.NONE;
      blackMatch.result = InternalMatchResult.FORFEIT_WIN;
      blackMatch.color = InternalMatchColor.NONE;
      break;
    }
  }

  white.matches.push(whiteMatch);
  black.matches.push(blackMatch);
}

function addBye(player: InternalPlayer, bye: Bye) {
  const newBye: InternalMatch = {
    color: InternalMatchColor.NONE,
    opponentId: "0000",
    result: InternalMatchResult.FULL_POINT_BYE,
    round: bye.round,
  };

  switch (bye.result) {
    case ByeMatchResult.FULL_POINT_BYE:
      newBye.result = InternalMatchResult.FULL_POINT_BYE;
      break;
    case ByeMatchResult.HALF_POINT_BYE:
      newBye.result = InternalMatchResult.HALF_POINT_BYE;
      break;
    case ByeMatchResult.PAIRING_ALLOCATED_BYE:
      newBye.result = InternalMatchResult.PAIRING_ALLOCATED_BYE;
      break;
    case ByeMatchResult.ZERO_POINT_BYE:
      newBye.result = InternalMatchResult.ZERO_POINT_BYE;
      break;
  }

  player.matches.push(newBye);
}

function calculatePlayerScore(player: InternalPlayer) {
  let score = 0;
  for (const match of player.matches) {
    switch (match.result) {
      case InternalMatchResult.WIN:
      case InternalMatchResult.FORFEIT_WIN:
      case InternalMatchResult.FULL_POINT_BYE:
      case InternalMatchResult.PAIRING_ALLOCATED_BYE:
        score += 1;
        break;
      case InternalMatchResult.DRAW:
      case InternalMatchResult.HALF_POINT_BYE:
        score += 0.5;
        break;
      case InternalMatchResult.LOSS:
      case InternalMatchResult.ZERO_POINT_BYE:
      case InternalMatchResult.FORFEIT_LOSS:
        score += 0;
        break;
    }
  }
  return score;
}
