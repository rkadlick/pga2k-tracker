import { Team } from '@/types';
import players from './data/snapshot/players.json';
import teamMembers from './data/snapshot/team_members.json';
import teams from './data/snapshot/teams.json';
import { teamNames } from './data/teamNames';

export interface TeamCreateData {
  name: string;
  players: { name: string; rating: number }[];
}

export interface TeamUpdateData {
  name?: string;
}

function getPlayersOnTeam(teamId: string) {
  const playerIds = teamMembers
    .filter(member => member.team_id === teamId)
    .map(member => member.player_id);

  return players
    .filter(player => playerIds.includes(player.id))
    .map(({ id, name, recent_rating }) => ({ id, name, recent_rating }));
}

function withPlayers(team: (typeof teams)[number]): Team {
  return { ...team, players: getPlayersOnTeam(team.id) } as Team;
}

export async function getTeams(): Promise<Team[]> {
  return teams
    .map(withPlayers)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTeam(id: string): Promise<Team | null> {
  const team = teams.find(team => team.id === id);
  return team ? withPlayers(team) : null;
}

/**
 * Find the team made up of exactly these two players
 */
export async function findTeamByPlayers(playerIds: string[]): Promise<Team | null> {
  const team = teams.find(team => {
    const members = teamMembers.filter(member => member.team_id === team.id);
    return members.length === 2 && members.every(member => playerIds.includes(member.player_id));
  });
  return (team as Team | undefined) ?? null;
}

/**
 * Generate a random team name from a predefined list
 */
export function generateTeamName(): string {
  const randomIndex = Math.floor(Math.random() * teamNames.length);
  return teamNames[randomIndex];
}

export async function getTeamPlayers(teamId: string) {
  return getPlayersOnTeam(teamId);
}

/**
 * Check if a team name already exists
 */
export async function checkTeamNameExists(name: string): Promise<boolean> {
  return teams.some(team => team.name === name);
}
