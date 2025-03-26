import { Match, HoleResultRecord, HoleResult, NinePlayed } from '@/types';
import { ApiResponse, formatError } from './errorHandling';

interface MatchCreateData {
  date_played: string; // ISO date string
  course_id: string;
  your_team_id: string;
  opponent_team_id: string;
  nine_played: NinePlayed;
  your_team_score: number;
  opponent_team_score: number;
  winner_id: string | null;
  rating_change?: number;
  margin?: number;
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
  nine_played?: NinePlayed;
  your_team_score?: number;
  opponent_team_score?: number;
  winner_id?: string | null;
  rating_change?: number;
  margin?: number;
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
    console.log(result);
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch matches');
    }
    console.log(result.data + ' result.data');
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
    console.log('result', result);
    
    return result;
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
    
    if (!response.ok) {
      const errorMessage = result.error || 'Failed to create match';
      const errorDetails = result.details ? `\n${result.details.join('\n')}` : '';
      throw new Error(`${errorMessage}${errorDetails}`);
    }
    
    return result;
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
export async function updateHoleResult(
  id: string, 
  result: HoleResult
): Promise<HoleResultRecord> {
  try {
    const response = await fetch(`/api/hole-results/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    });
    
    const resultData = await response.json() as ApiResponse<HoleResultRecord>;
    
    if (!response.ok) {
      throw new Error(resultData.error || 'Failed to update hole result');
    }
    
    return resultData.data!;
  } catch (error) {
    throw formatError(error).error;
  }
} 