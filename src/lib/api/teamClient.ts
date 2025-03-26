import { ApiResponse, formatError } from './errorHandling';

export interface TeamMember {
  name: string;
  rank: number;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  is_your_team: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamCreateData {
  name: string;
  members: TeamMember[];
  is_your_team?: boolean;
}

export interface TeamUpdateData {
  name?: string;
  members?: TeamMember[];
  is_your_team?: boolean;
}

/**
 * Fetch all teams
 */
export async function fetchTeams(): Promise<Team[]> {
  try {
    const response = await fetch('/api/teams');
    const result = await response.json() as ApiResponse<Team[]>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch teams');
    }
    
    return result.data || [];
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Fetch a single team with its details
 */
export async function fetchTeam(id: string): Promise<Team> {
  try {
    const response = await fetch(`/api/teams/${id}`);
    const result = await response.json() as ApiResponse<Team>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch team');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Create a new team
 */
export async function createTeam(teamData: TeamCreateData): Promise<Team> {
  try {
    console.log('teamData', teamData);
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });
    
    const result = await response.json() as ApiResponse<Team>;
    
    if (!response.ok) {
      const errorMessage = result.error || 'Failed to create team';
      const errorDetails = result.details ? `\n${result.details.join('\n')}` : '';
      throw new Error(`${errorMessage}${errorDetails}`);
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Update an existing team
 */
export async function updateTeam(id: string, teamData: TeamUpdateData): Promise<Team> {
  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
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