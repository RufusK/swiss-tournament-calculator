import { chunk, first, isEmpty, range } from "lodash-es";

import {
  Color,
  type ResultBye,
  type Player,
  type ResultPairing,
  type TournamentState,
} from "../types/externalTypes";
import { getRandomColor, isOdd, oppositeColor, sortPlayersById } from "./utils";

const pairColorForTop = (initialColour: Color, pairingNumber: number) =>
  isOdd(pairingNumber) ? initialColour : oppositeColor(initialColour);

const createPairing = (
  top: Player,
  bottom: Player,
  topColour: Color,
  round: number,
): ResultPairing => ({
  white: topColour === Color.WHITE ? top.id : bottom.id,
  black: topColour === Color.WHITE ? bottom.id : top.id,
});

export const generateFirstRound = (state: TournamentState) => {
  const { players } = state;

  const pairings: ResultPairing[] = [];
  const byes: ResultBye[] = [];

  const sortedPlayers = sortPlayersById(players);

  const half = Math.floor(sortedPlayers.length / 2);
  const [topHalf, bottomHalf, remaining] = chunk(sortedPlayers, half);

  if (!topHalf || !bottomHalf) {
    throw new Error("Not enough players to create pairings.");
  }

  if (!isEmpty(remaining)) {
    byes.push({
      player: first(remaining)?.id!,
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

    pairings.push(createPairing(top, bottom, topColour, 1));
  });

  return { pairings, byes, roundNumber: 1 };
};
