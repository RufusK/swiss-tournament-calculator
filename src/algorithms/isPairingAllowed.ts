import { ColorPreference, type InternalPlayer } from "../types/internalTypes";

export function assessPairing(
  player1: InternalPlayer,
  player2: InternalPlayer,
  isLastRound: boolean,
  maximumAchievableScore: number,
): boolean {
  // ABSOLUTE CRITERIA
  //
  // 2.1.1 [C1] Two participants shall not play against each other more than once
  if (player1.opponents.includes(player2.id)) {
    return false;
  }

  // 2.1.3 [C3] Non-topscorers (see Article 1.8) with the same absolute colour preference (see Article 1.7.1)
  // shall not meet
  if (
    !isColorPreferenceCompatible(
      player1,
      player2,
      isLastRound,
      maximumAchievableScore,
    )
  ) {
    return false;
  }

  return true;
}

function isColorPreferenceCompatible(
  player1: InternalPlayer,
  player2: InternalPlayer,
  isLastRound: boolean,
  maximumAchievableScore: number,
) {
  // 2.1.3 [C3] Non-topscorers (see Article 1.8) with the same absolute colour preference (see Article 1.7.1)
  // shall not meet (see the Basic Rules for Swiss, Articles 6 and 7).
  //
  // Topscorers are players who have a score of over 50% of the maximum possible score when pairing the final
  // round of the tournament.
  //
  // 1.7.1  An absolute colour preference occurs when a player's colour difference is greater than +1
  // or less than -1, or when a player had the same colour in the two latest rounds they played.
  // The preference is for White when the colour difference is less than -1 or when the last two games
  // were played with Black. The preference is for Black when the colour difference is greater than +1,
  // or when the last two games were played with White.

  const player1isTopScorer =
    player1.score > maximumAchievableScore / 2 && isLastRound;
  const player2isTopScorer =
    player2.score > maximumAchievableScore / 2 && isLastRound;

  if (
    !player1isTopScorer &&
    !player2isTopScorer &&
    ((player1.colorPreference == ColorPreference.ABSOLUTE_WHITE &&
      player2.colorPreference == ColorPreference.ABSOLUTE_WHITE) ||
      (player1.colorPreference == ColorPreference.ABSOLUTE_BLACK &&
        player2.colorPreference == ColorPreference.ABSOLUTE_BLACK))
  ) {
    return false;
  }
}
