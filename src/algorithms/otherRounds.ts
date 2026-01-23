import { POINTS_PER_WIN } from "../constants";
import { Bracket } from "./Bracket";
import type { Bye, calculatePairings, FloatInfo, Match } from "./externalTypes";
import { mapToInternalPlayers } from "./mapToInternalPlayers";
import { ScoreGroups } from "./ScoreGroup";
import { keyBy } from "lodash-es";

export const generateOtherRound: calculatePairings = (state) => {
  const {
    nextRound: round,
    matches: pastMatches,
    players: givenPlayers,
    byes: pastByes,
    totalNumberOfRounds,
  } = state;

  if (round == 1) {
    throw new Error("This implementation doesnt support round 1.");
  }

  const players = mapToInternalPlayers(givenPlayers, pastMatches, pastByes);
  const playersDict = keyBy(players, (player) => player.id);

  // create scoregroups
  const scoreGroups = new ScoreGroups(
    players.map((player) => ({ id: player.id, score: player.score })),
  );

  const nextScoreGroup = scoreGroups.getNextScoreGroup();

  if (nextScoreGroup) {
    const bracket = new Bracket(
      nextScoreGroup.players.map((player) => playersDict[player]!),
      [],
      totalNumberOfRounds * POINTS_PER_WIN,
      totalNumberOfRounds == round,
    );
  }

  // create pairings
  const pairings: Match[] = [];
  const byes: Bye[] = [];
  const floats: FloatInfo[] = [];

  return {
    pairings: [],
    byes: [],
    floats: [],
  };
};
