import type {
  Result,
  ResultBye,
  ResultPairing,
  TournamentState,
} from "../types/externalTypes";
import { mapToInternalPlayers } from "./mapToInternalPlayers";
import { mapToTrf } from "./mapToTrfLine";
import BbpPairingModule from "../bbpPairing/bbpPairing";

export const generateOtherRound = async (
  state: TournamentState,
): Promise<Result> => {
  const {
    matches: pastMatches,
    players: givenPlayers,
    byes: pastByes,
    totalNumberOfRounds,
  } = state;

  // calculate score and matches for each player
  const players = mapToInternalPlayers(givenPlayers, pastMatches, pastByes);

  // turn into a TRF-2016 string
  const trf = mapToTrf(totalNumberOfRounds, players);

  // use wasm bbpPairing engine
  const pairingEngine = await BbpPairingModule();
  const stringResult = pairingEngine.pairing(trf);

  // parse stringResult to pairings and byes
  const result: ([number, number] | [number])[] = JSON.parse(stringResult);
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
