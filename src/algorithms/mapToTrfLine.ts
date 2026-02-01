import type { InternalPlayer } from "../types/internalTypes";

export function mapToTrf(numberOfRounds: number, players: InternalPlayer[]) {
  let t = "012 Unknown Tournament";

  players.forEach((player) => {
    t += "\n";
    t += mapToTrfPlayerLine(player);
  });

  t += "\n";
  t += "XXR " + numberOfRounds.toString();

  return t;
}

export function mapToTrfPlayerLine(player: InternalPlayer): string {
  let t = "001 ";

  t += padLeft(player.id.toString(), 4);

  t += padRight("", 68);

  t += padLeft(player.score.toFixed(1), 6);

  t += padLeft("", 4);

  player.matches.forEach((match) => {
    t += padLeft(match.opponentId.toString(), 5);
    t += padRight(match.color, 1);
    t += padRight(match.result, 1);
  });

  return t;
}

function padLeft(a: string, b: number): string {
  if (a.length > b) {
    return a.slice(a.length - b);
  }
  return a.padStart(b, " ") + " ";
}

function padRight(a: string, b: number): string {
  if (a.length > b) {
    return a.slice(0, b);
  }
  return a.padEnd(b, " ") + " ";
}
