import { Color } from "./types";

export const isOdd = (count: number) => count % 2 === 1;

export const getRandomColor = () =>
  Math.random() < 0.5 ? Color.WHITE : Color.BLACK;

export const oppositeColor = (colour: Color) =>
  colour === Color.WHITE ? Color.BLACK : Color.WHITE;
