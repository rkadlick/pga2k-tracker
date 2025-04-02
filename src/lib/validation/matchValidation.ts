import { HoleResult, NinePlayed } from '@/types';

interface MatchData {
  date_played: string;
  course_id: string;
  your_team_id: string;
  opponent_team_id: string;
  nine_played: NinePlayed;
  holes_won: number;
  holes_lost: number;
  holes_tied: number;
  winner_id: string | null;
  playoffs: boolean;
  hole_results?: Array<{
    hole_number: number;
    result: HoleResult;
  }>;
}

type MatchUpdateData = Partial<MatchData>;

/**
 * Validates a date string in ISO format
 */
export function validateDate(date: string): string | null {
  if (!date) {
    return 'Date is required';
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date format';
  }
  
  // Future date check
  if (dateObj > new Date()) {
    return 'Date cannot be in the future';
  }
  
  return null;
}

/**
 * Validates a course ID
 */
export function validateCourseId(courseId: string): string | null {
  if (!courseId) {
    return 'Course is required';
  }
  
  return null;
}

/**
 * Validates a team ID
 */
export function validateTeamId(teamId: string): string | null {
  if (!teamId) {
    return 'Team is required';
  }
  
  return null;
}

/**
 * Validates a score value
 */
export function validateScore(score: number): string | null {
  if (score === undefined || score === null) {
    return 'Score is required';
  }
  
  if (!Number.isInteger(score) || score < 0) {
    return 'Score must be a non-negative integer';
  }
  
  return null;
}

/**
 * Validates a winner ID
 */
export function validateWinnerId(
  winnerId: string | null, 
  yourTeamId: string, 
  opponentTeamId: string, 
  yourTeamScore: number, 
  opponentTeamScore: number,
  playoffs: boolean
): string | null {
  if (winnerId === null) {
    // Null winner ID is allowed for ties
    if (yourTeamScore !== opponentTeamScore) {
      return 'Winner ID must be provided for non-tie matches';
    }
  } else if (winnerId !== yourTeamId && winnerId !== opponentTeamId) {
    return 'Winner ID must be one of the team IDs';
  } else if (!playoffs && // Only check scores if not playoffs
    (winnerId === yourTeamId && yourTeamScore <= opponentTeamScore) ||
    (winnerId === opponentTeamId && opponentTeamScore <= yourTeamScore)
  ) {
    return 'Winner ID must correspond to the team with the higher score';
  }
  
  return null;
}

/**
 * Validates hole result enum value
 */
export function validateHoleResult(result: HoleResult): string | null {
  const validResults: HoleResult[] = ['win', 'loss', 'tie', null];
  
  if (result !== null && !validResults.includes(result)) {
    return `Result must be one of: win, loss, tie, or null`;
  }
  
  return null;
}

/**
 * Validates hole number
 */
export function validateHoleNumber(holeNumber: number): string | null {
  if (!Number.isInteger(holeNumber) || holeNumber < 1 || holeNumber > 18) {
    return 'Hole number must be an integer between 1 and 18';
  }
  
  return null;
}

/**
 * Validates a nine played value
 */
export function validateNinePlayed(ninePlayed: NinePlayed): string | null {
  const validValues: NinePlayed[] = ['front', 'back'];
  if (!validValues.includes(ninePlayed)) {
    return `Must be one of: ${validValues.join(', ')}`;
  }
  
  return null;
}

/**
 * Validates playoffs flag
 */
export function validatePlayoffs(playoffs: boolean): string | null {
  if (typeof playoffs !== 'boolean') {
    return 'Playoffs must be a boolean value';
  }
  
  return null;
}

/**
 * Validates an array of hole results
 */
export function validateHoleResults(data: { holeResults: Array<{ hole_number: number; result: HoleResult }> }): string[] {
  const errors: string[] = [];

  if (!Array.isArray(data.holeResults)) {
    errors.push('Hole results must be an array');
    return errors;
  }

  data.holeResults.forEach((holeResult, index) => {
    const holeNumberError = validateHoleNumber(holeResult.hole_number);
    if (holeNumberError) {
      errors.push(`Hole ${index + 1}: ${holeNumberError}`);
    }
    
    const resultError = validateHoleResult(holeResult.result);
    if (resultError) {
      errors.push(`Hole ${index + 1}: ${resultError}`);
    }
  });

  return errors;
}

/**
 * Validates that a tied match must have playoffs
 */
export function validateTiedMatch(
  holeResults: Array<{ hole_number: number; result: HoleResult }> | undefined,
  playoffs: boolean | undefined
): string | null {
  if (!holeResults || holeResults.length === 0) {
    return null;
    }
  // Must have exactly 9 holes played
  if (holeResults.length !== 9) {
    return null; // Don't validate playoffs for incomplete matches
  }

  // Calculate total score for each team
  const counts = holeResults.reduce((acc, hr) => {
    if (hr.result === 'win') return { ...acc, wins: acc.wins + 1 };
    if (hr.result === 'loss') return { ...acc, losses: acc.losses + 1 };
    if (hr.result === 'tie') return { ...acc, ties: acc.ties + 1 };
    return acc;
  }, { wins: 0, losses: 0, ties: 0 });

  // Calculate final scores (0.5 points for ties)
  const yourTeamScore = counts.wins + (counts.ties * 0.5);
  const opponentTeamScore = counts.losses + (counts.ties * 0.5);
  
  // Match is tied if scores are equal
  const isMatchTied = yourTeamScore === opponentTeamScore;
  
  if (isMatchTied && playoffs === false) {
    return 'A tied match must go to playoffs';
  }
  
  return null;
}


/**
 * Validates a complete match data object for creation
 */
export function validateMatchData(matchData: MatchData): string[] {
  const errors: string[] = [];
  
  // Required fields
  const dateError = validateDate(matchData.date_played);
  if (dateError) errors.push(`Date: ${dateError}`);
  
  const courseIdError = validateCourseId(matchData.course_id);
  if (courseIdError) errors.push(`Course: ${courseIdError}`);
  
  const yourTeamIdError = validateTeamId(matchData.your_team_id);
  if (yourTeamIdError) errors.push(`Your Team: ${yourTeamIdError}`);
  
  const opponentTeamIdError = validateTeamId(matchData.opponent_team_id);
  if (opponentTeamIdError) errors.push(`Opponent Team: ${opponentTeamIdError}`);
  
  const ninePlayedError = validateNinePlayed(matchData.nine_played);
  if (ninePlayedError) errors.push(`Nine Played: ${ninePlayedError}`);
  
  // Validate hole counts
  const holesWonError = validateScore(matchData.holes_won);
  if (holesWonError) errors.push(`Holes Won: ${holesWonError}`);
  
  const holesLostError = validateScore(matchData.holes_lost);
  if (holesLostError) errors.push(`Holes Lost: ${holesLostError}`);
  
  const holesTiedError = validateScore(matchData.holes_tied);
  if (holesTiedError) errors.push(`Holes Tied: ${holesTiedError}`);
  
  const playoffsError = validatePlayoffs(matchData.playoffs);
  if (playoffsError) errors.push(`Playoffs: ${playoffsError}`);

  // Validate tied match condition
  const tiedMatchError = validateTiedMatch(matchData.hole_results, matchData.playoffs);
  if (tiedMatchError) errors.push(tiedMatchError);
  
  // Only validate winner ID if there are no errors with the team IDs and hole counts
  if (!yourTeamIdError && !opponentTeamIdError && !holesWonError && !holesLostError && !holesTiedError) {
    const winnerIdError = validateWinnerId(
      matchData.winner_id,
      matchData.your_team_id,
      matchData.opponent_team_id,
      matchData.holes_won + (matchData.holes_tied * 0.5),
      matchData.holes_lost + (matchData.holes_tied * 0.5),
      matchData.playoffs
    );
    if (winnerIdError) errors.push(`Winner: ${winnerIdError}`);
  }
  // Validate hole results if provided
  if (matchData.hole_results && Array.isArray(matchData.hole_results)) {
    const holeResultsErrors = validateHoleResults({ holeResults: matchData.hole_results });
    if (holeResultsErrors.length > 0) {
      errors.push('Hole Results:');
      errors.push(...holeResultsErrors);
    }
  }
  
  return errors;
}

/**
 * Validates match data for updates (partial data is allowed)
 */
export function validateMatchUpdateData(matchData: MatchUpdateData): string[] {
  const errors: string[] = [];
  
  // Optional fields - only validate if provided
  if (matchData.date_played !== undefined) {
    const dateError = validateDate(matchData.date_played);
    if (dateError) errors.push(`Date: ${dateError}`);
  }
  
  if (matchData.course_id !== undefined) {
    const courseIdError = validateCourseId(matchData.course_id);
    if (courseIdError) errors.push(`Course: ${courseIdError}`);
  }
  
  if (matchData.your_team_id !== undefined) {
    const yourTeamIdError = validateTeamId(matchData.your_team_id);
    if (yourTeamIdError) errors.push(`Your Team: ${yourTeamIdError}`);
  }
  
  if (matchData.opponent_team_id !== undefined) {
    const opponentTeamIdError = validateTeamId(matchData.opponent_team_id);
    if (opponentTeamIdError) errors.push(`Opponent Team: ${opponentTeamIdError}`);
  }
  
  if (matchData.nine_played !== undefined) {
    const ninePlayedError = validateNinePlayed(matchData.nine_played);
    if (ninePlayedError) errors.push(`Nine Played: ${ninePlayedError}`);
  }
  
  if (matchData.holes_won !== undefined) {
    const holesWonError = validateScore(matchData.holes_won);
    if (holesWonError) errors.push(`Holes Won: ${holesWonError}`);
  }
  
  if (matchData.holes_lost !== undefined) {
    const holesLostError = validateScore(matchData.holes_lost);
    if (holesLostError) errors.push(`Holes Lost: ${holesLostError}`);
  }
  
  if (matchData.holes_tied !== undefined) {
    const holesTiedError = validateScore(matchData.holes_tied);
    if (holesTiedError) errors.push(`Holes Tied: ${holesTiedError}`);
  }
  
  if (matchData.playoffs !== undefined) {
    const playoffsError = validatePlayoffs(matchData.playoffs);
    if (playoffsError) errors.push(`Playoffs: ${playoffsError}`);
  }

  // Validate tied match condition
  const tiedMatchError = validateTiedMatch(matchData.hole_results, matchData.playoffs);
  if (tiedMatchError) errors.push(tiedMatchError);
  
  // Only validate winner ID if all the necessary fields are present
  if (
    matchData.winner_id !== undefined &&
    matchData.your_team_id !== undefined &&
    matchData.opponent_team_id !== undefined &&
    matchData.holes_won !== undefined &&
    matchData.holes_lost !== undefined &&
    matchData.holes_tied !== undefined
  ) {
    const winnerIdError = validateWinnerId(
      matchData.winner_id,
      matchData.your_team_id,
      matchData.opponent_team_id,
      matchData.holes_won + (matchData.holes_tied * 0.5),
      matchData.holes_lost + (matchData.holes_tied * 0.5),
      matchData.playoffs || false
    );
    if (winnerIdError) errors.push(`Winner: ${winnerIdError}`);
  }
  
  return errors;
}