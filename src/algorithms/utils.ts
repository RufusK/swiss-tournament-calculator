import { orderBy } from "lodash-es";
import { POINTS_PER_WIN } from "../constants";
import { Color, type Player } from "../types/externalTypes";
import type { InternalPlayer } from "../types/internalTypes";

export const isOdd = (count: number) => count % 2 === 1;

export const getRandomColor = () =>
  Math.random() < 0.5 ? Color.WHITE : Color.BLACK;

export const oppositeColor = (colour: Color) =>
  colour === Color.WHITE ? Color.BLACK : Color.WHITE;

export const isTopScorer = (score: number, round: number) =>
  score > (round * POINTS_PER_WIN) / 2;

export const sortPlayersByEloAndId = (players: Player[]) =>
  orderBy(players, [(p) => p.elo ?? 0, (p) => p.id], ["desc", "asc"]);
