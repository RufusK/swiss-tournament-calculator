import { slice } from "lodash-es";
import { sortPlayersByScoreAndId } from "./utils";
import type { InternalPlayer } from "./internalTypes";

export function createInitialBracketSubgroups(
  residents: InternalPlayer[],
  downFloaters: InternalPlayer[],
) {
  // 3.1.1 M0 is the number of MDP(s) coming from the previous bracket. It may be zero.
  const M0 = downFloaters.length;

  // 3.1.2 MaxPairs is the maximum number of pairs that can be produced in the bracket under consideration (see [C6], Article 2.4.1).
  // Note:   MaxPairs is usually equal to the number of players divided by two and rounded downwards. However, if, for instance, M0 is greater than the number of resident players, MaxPairs is at most equal to the number of resident players.
  const MAX_PAIRS =
    M0 > residents.length
      ? residents.length
      : Math.floor((residents.length + downFloaters.length) / 2);

  // 3.1.3      M1 is the number of MDP(s) that are paired in the bracket.
  // Note:   M1 is usually equal to the number of MDPs coming from the previous bracket, which may be zero.
  // However, if, for instance, M0 is greater than the number of resident players, M1 is at most equal to the number of resident players.
  // M1 can never be greater than MaxPairs.
  const M1 = Math.min(M0, MAX_PAIRS);

  const players = [...residents, ...downFloaters];

  let S1: InternalPlayer[] = [];
  let S2: InternalPlayer[] = [];

  const sortedPlayers = sortPlayersByScoreAndId(players);
  const IS_HOMOGENEOUS = sortedPlayers.every(
    (player) => player.score === sortedPlayers[0]!.score,
  );

  if (IS_HOMOGENEOUS) {
    S1 = slice(sortedPlayers, 0, MAX_PAIRS);
    S2 = slice(sortedPlayers, MAX_PAIRS, sortedPlayers.length);
  } else {
    S1 = slice(sortedPlayers, 0, M1);
    S2 = slice(sortedPlayers, M1, sortedPlayers.length);
  }

  // TODO: Limbo handling as said in 3.2.4

  return {
    M0,
    M1,
    MAX_PAIRS,
    IS_HOMOGENEOUS,
    S1,
    S2,
  };
}
