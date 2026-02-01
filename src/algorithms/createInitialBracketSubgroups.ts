import { range, slice } from "lodash-es";
import { sortPlayersByScoreAndId } from "./utils";
import type { InternalPlayer } from "../types/internalTypes";

type Subgroup = InternalPlayer[];

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

export function createCandidatePairings(
  M0: number,
  M1: number,
  MAX_PAIRS: number,
  IS_HOMOGENEOUS: boolean,
  S1: Subgroup,
  S2: Subgroup,
) {
  // 3.3.1 S1 players are tentatively paired with S2 players
  const pairs: [InternalPlayer, InternalPlayer][] = [];

  range(MAX_PAIRS).forEach((i) => {
    pairs.push([S1[i]!, S2[i]!]);
  });

  // 3.3.3 In a heterogeneous bracket: the pairs formed as explained in Article 3.3.1 match M1 MDPs from S1
  // with M1 resident players from S2. This is called an MDP-Pairing.
  // The remaining resident players (if any) give rise to the remainder (see Article 1.3),
  // which is then paired with the same rules used for a homogeneous bracket.
  if (!IS_HOMOGENEOUS) {
    const remainder = slice(S2, M1);
  }

  return pairs;
}
