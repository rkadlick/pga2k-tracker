import { TeamCreateData, TeamUpdateData } from '@/lib/teamService';

/**
 * Validates a team name
 */
export function validateTeamName(name: string): string | null {
  if (!name) {
    return 'Team name is required';
  }
  
  if (name.length < 3) {
    return 'Team name must be at least 3 characters long';
  }
  
  if (name.length > 50) {
    return 'Team name must be less than 50 characters';
  }
  
  return null;
}

/**
 * Validates players array
 */
export function validatePlayers(players: { name: string; rating: number }[]): string | null {
  if (!Array.isArray(players)) {
    return 'Players must be an array';
  }

  if (players.length !== 2) {
    return 'Team must have exactly 2 players';
  }

  for (const player of players) {
    if (!player.name) {
      return 'All players must have a name';
    }
    if (typeof player.rating !== 'number' || player.rating <= 0) {
      return 'All players must have a valid rating';
    }
  }

  return null;
}

/**
 * Validates a complete team data object for creation
 */
export function validateTeamData(teamData: TeamCreateData): string[] {
  const errors: string[] = [];
  
  // Validate team name
  const nameError = validateTeamName(teamData.name);
  if (nameError) errors.push(`Team Name: ${nameError}`);
  
  // Validate players
  const playersError = validatePlayers(teamData.players);
  if (playersError) errors.push(playersError);
  
  return errors;
}

/**
 * Validates team data for updates
 */
export function validateTeamUpdateData(teamData: TeamUpdateData): string[] {
  const errors: string[] = [];
  
  // Only validate name if provided
  if (teamData.name !== undefined) {
    const nameError = validateTeamName(teamData.name);
    if (nameError) errors.push(`Team Name: ${nameError}`);
  }
  
  return errors;
}
