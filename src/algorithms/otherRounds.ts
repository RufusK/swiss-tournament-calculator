import type {
  ResultBye,
  ResultPairing,
  TournamentState,
} from "../types/externalTypes";
import { mapToInternalPlayers } from "./mapToInternalPlayers";
import { mapToTrf } from "./mapToTrfLine";
import BbpPairingModule from "../bbpPairing/bbpPairing";

export const generateOtherRound = async (state: TournamentState) => {
  const {
    matches: pastMatches,
    players: givenPlayers,
    byes: pastByes,
    totalNumberOfRounds,
  } = state;

  const players = mapToInternalPlayers(givenPlayers, pastMatches, pastByes);

  const trf = mapToTrf(totalNumberOfRounds, players);

  const pairingEngine = await BbpPairingModule();

  const stringResult = pairingEngine.pairing(trf);

  const result: ([number, number] | [number])[] = JSON.parse(stringResult);

  console.log(typeof result);

  const pairings: ResultPairing[] = [];
  const byes: ResultBye[] = [];

  result.forEach(([player1, player2]) => {
    if (player2) {
      pairings.push({
        black: player1,
        white: player2,
      });
    } else {
      byes.push({
        player: player1,
      });
    }
  });

  return {
    pairings,
    byes,
  };
};
