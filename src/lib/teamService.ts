import { createClient } from '@/utils/supabase/server';
import { Team } from '@/types';

interface TeamCreateData {
  name: string;
  members: { name: string; rank: number; }[];
  is_your_team?: boolean;
}

interface TeamUpdateData {
  name?: string;
  members?: { name: string; rank: number; }[];
  is_your_team?: boolean;
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

/**
 * Create a new team with validation
 */
export async function createTeam(teamData: TeamCreateData): Promise<Team> {
  const supabase = await createClient();
  
  // Transform the data for the database
  const dbTeamData = {
    name: teamData.name,
    players: teamData.members.map(m => m.name),
    ratings: teamData.members.map(m => m.rank),
    is_your_team: teamData.is_your_team || false
  };

  const { data, error } = await supabase
    .from('teams')
    .insert([dbTeamData])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create team');
  return data;
}

/**
 * Update an existing team with validation
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

