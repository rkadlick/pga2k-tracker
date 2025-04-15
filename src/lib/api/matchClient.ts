import { Match, HoleResultRecord, NinePlayed } from '@/types';
import { ApiResponse, formatError } from './errorHandling';

interface MatchCreateData {
  date_played: string; // ISO date string
  course_id: string;
  your_team_id: string;
  opponent_team_id: string;
  player1_id: string;
  player1_rating: number;
  player2_id: string;
  player2_rating: number;
  opponent1_id: string;
  opponent1_rating: number;
  opponent2_id: string;
  opponent2_rating: number;
  nine_played: NinePlayed;
  holes_won: number;
  holes_tied: number;
  holes_lost: number;
  winner_id: string | null;
  rating_change?: number;
  playoffs: boolean;
  notes?: string;
  tags?: string[];
  hole_results?: HoleResultRecord[];
}

interface MatchUpdateData {
  date_played?: string;
  course_id?: string;
  your_team_id?: string;
  opponent_team_id?: string;
  player1_id?: string;
  player1_rating?: number;
  player2_id?: string;
  player2_rating?: number;
  opponent1_id?: string;
  opponent1_rating?: number;
  opponent2_id?: string;
  opponent2_rating?: number;
  nine_played?: NinePlayed;
  winner_id?: string | null;
  rating_change?: number;
  playoffs?: boolean;
  notes?: string;
  tags?: string[];
}

/**
 * Fetch all matches
 */
export async function fetchMatches(): Promise<Match[]> {
  try {
    const response = await fetch('/api/matches');
    const result = await response.json() as ApiResponse<Match[]>;
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch matches');
    }
    return result.data || [];
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Fetch a single match with its details
 */
export async function fetchMatch(id: string): Promise<Match> {
  try {
    const response = await fetch(`/api/matches/${id}`);
    const result = await response.json() as ApiResponse<Match>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch match');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Create a new match
 */
export async function createMatch(matchData: MatchCreateData): Promise<Match> {
  try {
    const response = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData),
    });
    
    const result = await response.json() as ApiResponse<Match>;
    console.log('result', result);
    
    if (!response.ok) {
      const errorMessage = result.error || 'Failed to create match';
      const errorDetails = result.details ? `\n${result.details.join('\n')}` : '';
      throw new Error(`${errorMessage}${errorDetails}`);
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Update an existing match
 */
export async function updateMatch(id: string, matchData: MatchUpdateData): Promise<Match> {
  try {
    const response = await fetch(`/api/matches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    
    const result = await response.json() as ApiResponse<Match>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update match');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Delete a match
 */
export async function deleteMatch(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/matches/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const result = await response.json() as ApiResponse<unknown>;
      throw new Error(result.error || 'Failed to delete match');
    }
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Add hole results to a match
 */
export async function addHoleResults(
  matchId: string, 
  holeResults: Omit<HoleResultRecord, 'id' | 'created_at'>[]
): Promise<HoleResultRecord[]> {
  try {
    const response = await fetch(`/api/matches/${matchId}/holes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holeResults }),
    });
    
    const result = await response.json() as ApiResponse<HoleResultRecord[]>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to add hole results');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}   

/**
 * Update hole result
 */
export async function updateHoleResults(
  matchId: string, 
  holeResults: Omit<HoleResultRecord, 'id' | 'created_at'>[]
): Promise<HoleResultRecord[]> {
  try {
    const response = await fetch(`/api/matches/${matchId}/holes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holeResults }),
    });
    
    const resultData = await response.json() as ApiResponse<HoleResultRecord[]>;
    
    if (!response.ok) {
      throw new Error(resultData.error || 'Failed to update hole results ');
    }
    
    return resultData.data!;
  } catch (error) {
    throw formatError(error).error;
  }
} 

/**
 * Update player ratings    
 */
export async function updatePlayerRatings(matchId: string): Promise<void> {
  try {
    const response = await fetch(`/api/matches/${matchId}/update-ratings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId }),
    });
    
    const result = await response.json() as ApiResponse<Match>;

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update player ratings');
    }
  } catch (error) {
    throw formatError(error).error;
  }
}