import type { Bye, Match, Player } from "./externalTypes";
import { InternalPlayer } from "./InternalPlayer";

export function mapToInternalPlayers(
  players: Player[],
  pastMatches: Match[],
  pastByes: Bye[],
): InternalPlayer[] {
  const p = players.map((player) => new InternalPlayer(player.id));

  pastMatches.forEach((match) => {
    const player1 = p.find((player) => player.id === match.white);
    const player2 = p.find((player) => player.id === match.black);

    if (player1 && player2) {
      player1.addMatch(match);
      player2.addMatch(match);
    }
  });

  pastByes.forEach((bye) => {
    const player = p.find((player) => player.id === bye.player);
    if (player) {
      player.addBye(bye);
    }
  });

  return p;
}
