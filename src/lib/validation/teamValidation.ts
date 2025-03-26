import { TeamMember, TeamCreateData, TeamUpdateData } from '@/lib/api/teamClient';

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
 * Validates a member name
 */
export function validateMemberName(name: string): string | null {
  if (!name) {
    return 'Member name is required';
  }
  
  if (name.length < 2) {
    return 'Member name must be at least 2 characters long';
  }
  
  if (name.length > 50) {
    return 'Member name must be less than 50 characters';
  }
  
  return null;
}

/**
 * Validates a member rank
 */
export function validateMemberRank(rank: number): string | null {
  if (rank === undefined || rank === null) {
    return 'Rank is required';
  }
  
  if (!Number.isInteger(rank) || rank < 0) {
    return 'Rank must be a non-negative integer';
  }
  
  return null;
}

/**
 * Validates a team member object
 */
export function validateTeamMember(member: TeamMember): string[] {
  const errors: string[] = [];
  
  const nameError = validateMemberName(member.name);
  if (nameError) errors.push(`Member Name: ${nameError}`);
  
  const rankError = validateMemberRank(member.rank);
  if (rankError) errors.push(`Member Rank: ${rankError}`);
  
  return errors;
}

/**
 * Validates a complete team data object for creation
 */
export function validateTeamData(teamData: TeamCreateData & { is_your_team: boolean }): string[] {
  const errors: string[] = [];
  
  // Validate team name
  const nameError = validateTeamName(teamData.name);
  if (nameError) errors.push(`Team Name: ${nameError}`);
  
  // Validate members array
  if (!Array.isArray(teamData.members)) {
    errors.push('Members must be an array');
  } else {
    if (teamData.members.length !== 2) {
      errors.push('Team must have exactly 2 members');
    }
    
    teamData.members.forEach((member, index) => {
      const memberErrors = validateTeamMember(member);
      memberErrors.forEach(error => {
        errors.push(`Member ${index + 1}: ${error}`);
      });
    });
  }
  
  return errors;
}

/**
 * Validates team data for updates (partial data is allowed)
 */
export function validateTeamUpdateData(teamData: TeamUpdateData): string[] {
  const errors: string[] = [];
  
  // Optional fields - only validate if provided
  if (teamData.name !== undefined) {
    const nameError = validateTeamName(teamData.name);
    if (nameError) errors.push(`Team Name: ${nameError}`);
  }
  
  if (teamData.members !== undefined) {
    if (!Array.isArray(teamData.members)) {
      errors.push('Members must be an array');
    } else {
      if (teamData.members.length !== 2) {
        errors.push('Team must have exactly 2 members');
      }
      
      teamData.members.forEach((member, index) => {
        const memberErrors = validateTeamMember(member);
        memberErrors.forEach(error => {
          errors.push(`Member ${index + 1}: ${error}`);
        });
      });
    }
  }
  
  return errors;
}
