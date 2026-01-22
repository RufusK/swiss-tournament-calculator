import { chunk, first, isEmpty, orderBy, range } from "lodash-es";

import {
  type Bye,
  Color,
  type FloatInfo,
  type generatePairings,
  type Pairing,
  type Player,
} from "./types";

/* ---------- helpers ---------- */

const sortPlayers = (players: Player[]) =>
  orderBy(players, [(p) => p.elo ?? 0, "id"], ["desc", "asc"]);

const isOdd = (count: number) => count % 2 === 1;

const getRandomColor = () => (Math.random() < 0.5 ? Color.WHITE : Color.BLACK);

const oppositeColor = (colour: Color) =>
  colour === Color.WHITE ? Color.BLACK : Color.WHITE;

const pairColourForTop = (initialColour: Color, pairingNumber: number) =>
  isOdd(pairingNumber) ? initialColour : oppositeColor(initialColour);

const createPairing = (
  top: Player,
  bottom: Player,
  topColour: Color,
  round: number,
): Pairing => ({
  white: topColour === Color.WHITE ? top.id : bottom.id,
  black: topColour === Color.WHITE ? bottom.id : top.id,
  round,
});

/* ---------- main ---------- */

export const generateFirstRound: generatePairings = (state, _constraints) => {
  const { round, players } = state;

  if (round !== 1) {
    throw new Error("This implementation only supports round 1.");
  }

  const pairings: Pairing[] = [];
  const byes: Bye[] = [];
  const floats: FloatInfo[] = [];

  const sortedPlayers = sortPlayers(players);

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

    const topColour = pairColourForTop(initialColour, pairingNumber);

    pairings.push(createPairing(top, bottom, topColour, round));
  });

  return { pairings, byes, floats };
};
