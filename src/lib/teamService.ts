import { createClient } from '@/utils/supabase/server';
import { Team } from '@/types';

export interface TeamCreateData {
  name: string;
  players: { name: string; rating: number }[];
}

export interface TeamUpdateData {
  name?: string;
}

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data || [];
}

export async function getTeam(id: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
}

interface ExistingPlayer {
  id: string;
  name: string;
  recent_rating: number;
}

async function findPlayersByNames(names: string[]): Promise<ExistingPlayer[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('players')
    .select('id, name, recent_rating')
    .in('name', names);

  if (error) throw error;
  return data || [];
}

async function createOrUpdatePlayers(players: { name: string; rating: number }[]): Promise<string[]> {
  const supabase = await createClient();
  
  // First find existing players
  const existingPlayers = await findPlayersByNames(players.map(p => p.name));
  const playerIds: string[] = [];

  for (const player of players) {
    const existingPlayer = existingPlayers.find(ep => ep.name === player.name);
    
    if (existingPlayer) {
      // Update existing player's rating
      const { error } = await supabase
        .from('players')
        .update({ recent_rating: player.rating })
        .eq('id', existingPlayer.id);
      
      if (error) throw error;
      playerIds.push(existingPlayer.id);
    } else {
      // Create new player
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: player.name,
          recent_rating: player.rating
        }])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create player');
      playerIds.push(data.id);
    }
  }

  return playerIds;
}

async function findExistingTeamWithPlayers(playerIds: string[]): Promise<Team | null> {
  if (playerIds.length !== 2) return null;
  
  const supabase = await createClient();
  
  // Get all teams that have either of these players
  const { data: teamMembers, error: membersError } = await supabase
    .from('team_members')
    .select('team_id, player_id')
    .in('player_id', playerIds);

  if (membersError) throw membersError;
  if (!teamMembers) return null;

  // Group team members by team_id
  const teamMembersByTeam = teamMembers.reduce((acc, tm) => {
    acc[tm.team_id] = [...(acc[tm.team_id] || []), tm.player_id];
    return acc;
  }, {} as Record<string, string[]>);

  // Find a team that has exactly these two players
  const matchingTeamId = Object.entries(teamMembersByTeam)
    .find(([, members]) => 
      members.length === 2 && 
      members.every(id => playerIds.includes(id))
    )?.[0];

  if (!matchingTeamId) return null;

  // Get the team details
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', matchingTeamId)
    .single();

  if (teamError) throw teamError;
  return team;
}

/**
 * Create a new team and its member associations, or find existing team and update ratings
 */
export async function createTeam(teamData: TeamCreateData): Promise<{ team: Team; wasExisting: boolean }> {
  const supabase = await createClient();

  // First create or update players and get their IDs
  const playerIds = await createOrUpdatePlayers(teamData.players);

  // Check if these players are already on a team together
  const existingTeam = await findExistingTeamWithPlayers(playerIds);
  
  if (existingTeam) {
    return { team: existingTeam, wasExisting: true };
  }

  // Create new team if no existing team found
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert([{
      name: teamData.name,
      is_your_team: false
    }])
    .select()
    .single();

  if (teamError) throw teamError;
  if (!team) throw new Error('Failed to create team');

  // Create team member associations
  const teamMembers = playerIds.map(playerId => ({
    team_id: team.id,
    player_id: playerId
  }));

  const { error: membersError } = await supabase
    .from('team_members')
    .insert(teamMembers);

  if (membersError) {
    // If creating team members fails, we should delete the team
    await supabase
      .from('teams')
      .delete()
      .eq('id', team.id);
    throw membersError;
  }

  return { team, wasExisting: false };
}

/**
 * Update an existing team
 */
export async function updateTeam(id: string, teamData: TeamUpdateData): Promise<Team> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .update(teamData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Team not found');
  return data;
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Generate a random team name from a predefined list
 */
export function generateTeamName(): string {
  const teamNames = [
    'Eagle Warriors',
    'Birdie Brigade',
    'Par Excellence',
    'Fairway Fighters',
    'Green Machines',
    'Bunker Busters',
    'Putting Pirates',
    'Drive Dynasty',
    'Chip Champions',
    'Wedge Warriors'
  ];
  
  const randomIndex = Math.floor(Math.random() * teamNames.length);
  return teamNames[randomIndex];
}

export async function getTeamPlayers(teamId: string) {
  const supabase = await createClient();

  // First get team members
  const { data: teamMembers, error: teamMembersError } = await supabase
    .from('team_members')
    .select('player_id')
    .eq('team_id', teamId);

  if (teamMembersError) throw teamMembersError;
  if (!teamMembers) return [];

  // Then get the players
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('name, recent_rating')
    .in('id', teamMembers.map(tm => tm.player_id));

  if (playersError) throw playersError;
  
  return players || [];
}

