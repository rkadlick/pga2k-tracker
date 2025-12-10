import { formatError } from './errorHandling';
import { Team, Player, TeamCreateData, ApiResponse } from '@/types';

/**
 * Fetch all teams
 */
export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch('/api/teams');
  const data = await response.json();
  return data.data;
}

/**
 * Fetch a single team with its details
 */
export async function fetchTeam(id: string): Promise<Team> {
  const response = await fetch(`/api/teams/${id}`);
  const data = await response.json();
  return data.data;
}

/**
 * Create a new team
 */
export async function createTeam(data: TeamCreateData): Promise<{ team: Team; wasExisting: boolean }> {
  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json() as ApiResponse<{ team: Team; wasExisting: boolean }>;
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to create team');
  }
  
  return result.data!;
}

/**
 * Update an existing team
 */
export async function updateTeam(id: string, name: string): Promise<Team> {
  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    
    const result = await response.json() as ApiResponse<Team>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update team');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const result = await response.json() as ApiResponse<unknown>;
      throw new Error(result.error || 'Failed to delete team');
    }
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Generate a random team name
 */
export async function generateTeamName(): Promise<string> {
  try {
    const response = await fetch('/api/teams/generate-name');
    const result = await response.json() as ApiResponse<{ name: string }>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to generate team name');
    }
    
    return result.data!.name;
  } catch (error) {
    throw formatError(error).error;
  }
}

export async function createPlayer(name: string, rating: number): Promise<Player> {
  const response = await fetch('/api/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, recent_rating: rating })
  });

  if (!response.ok) {
    throw new Error(`Failed to create player: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getTeamPlayers(teamId: string): Promise<{ id: string; name: string; recent_rating: number; }[]> {
  const response = await fetch(`/api/teams/${teamId}/players`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch team players: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

export async function updatePlayerRating(playerId: string, rating: number): Promise<void> {
  const response = await fetch(`/api/players/${playerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recent_rating: rating })
  });

  if (!response.ok) {
    throw new Error(`Failed to update player rating: ${response.statusText}`);
  }
}

export async function findExistingTeamWithPlayers(playerIds: string[]): Promise<Team | null> {
  const response = await fetch(`/api/teams/find-by-players?playerIds=${playerIds.join(',')}`);
  
  if (!response.ok) {
    throw new Error(`Failed to find team: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || null;
}

/**
 * Check if a team name already exists
 */
export async function checkTeamNameExists(name: string): Promise<boolean> {
  try {
    const response = await fetch('/api/teams/check-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    
    const result = await response.json() as ApiResponse<{ exists: boolean }>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to check team name');
    }
    
    return result.data!.exists;
  } catch (error) {
    throw formatError(error).error;
  }
} 