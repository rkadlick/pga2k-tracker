import { Match, HoleResultRecord } from '@/types';
import courses from './data/snapshot/courses.json';
import holeResults from './data/snapshot/hole_results.json';
import matches from './data/snapshot/matches.json';
import players from './data/snapshot/players.json';
import teams from './data/snapshot/teams.json';

function nameOf(rows: { id: string; name: string }[], id: string): string {
  return rows.find(row => row.id === id)?.name ?? '';
}

function withRelations(match: (typeof matches)[number]): Match {
  return {
    ...match,
    course: nameOf(courses, match.course_id),
    your_team: nameOf(teams, match.your_team_id),
    opponent_team: nameOf(teams, match.opponent_team_id),
    player1_name: nameOf(players, match.player1_id),
    player2_name: nameOf(players, match.player2_id),
    opponent1_name: nameOf(players, match.opponent1_id),
    opponent2_name: nameOf(players, match.opponent2_id),
    hole_results: (holeResults as HoleResultRecord[])
      .filter(result => result.match_id === match.id)
      .sort((a, b) => a.hole_number - b.hole_number)
  } as Match;
}

/**
 * Get all matches with related information, most recent first
 */
export async function getMatches(): Promise<Match[]> {
  return [...matches]
    .sort((a, b) =>
      b.date_played.localeCompare(a.date_played) || b.created_at.localeCompare(a.created_at)
    )
    .map(withRelations);
}

/**
 * Get a single match by ID with all related data
 */
export async function getMatchWithDetails(id: string): Promise<Match | null> {
  const match = matches.find(match => match.id === id);
  return match ? withRelations(match) : null;
}
