import { chunk, first, isEmpty, range } from "lodash-es";

import {
  Color,
  type Bye,
  type FloatInfo,
  type calculatePairings,
  type Match,
  type Player,
} from "../types/externalTypes";
import {
  getRandomColor,
  isOdd,
  oppositeColor,
  sortPlayersByEloAndId,
} from "./utils";

const pairColorForTop = (initialColour: Color, pairingNumber: number) =>
  isOdd(pairingNumber) ? initialColour : oppositeColor(initialColour);

const createPairing = (
  top: Player,
  bottom: Player,
  topColour: Color,
  round: number,
): Match => ({
  white: topColour === Color.WHITE ? top.id : bottom.id,
  black: topColour === Color.WHITE ? bottom.id : top.id,
  round,
});

export const generateFirstRound: calculatePairings = (state) => {
  const { nextRound: round, players } = state;

  if (round !== 1) {
    throw new Error("This implementation only supports round 1.");
  }

  const pairings: Match[] = [];
  const byes: Bye[] = [];
  const floats: FloatInfo[] = [];

  const sortedPlayers = sortPlayersByEloAndId(players);

  const half = Math.floor(sortedPlayers.length / 2);
  const [topHalf, bottomHalf, remaining] = chunk(sortedPlayers, half);

  if (!topHalf || !bottomHalf) {
    throw new Error("Not enough players to create pairings.");
  }

  if (!isEmpty(remaining)) {
    byes.push({
      player: first(remaining)?.id!,
      round,
    });
  }

  const initialColour = getRandomColor();

  range(half).forEach((i) => {
    const pairingNumber = i + 1;

    const top = topHalf[i];
    const bottom = bottomHalf[i];

    if (!top || !bottom) {
      throw new Error("Mismatched pairing - missing player.");
    }

    const topColour = pairColorForTop(initialColour, pairingNumber);

    pairings.push(createPairing(top, bottom, topColour, round));
  });

  return { pairings, byes, floats };
};
