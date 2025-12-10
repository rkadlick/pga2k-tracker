import { useState, useEffect, useCallback, useRef } from 'react';
import * as teamClient from '@/lib/api/teamClient';
import { Team, TeamCreateData, TeamUpdateData, UseTeamsReturn } from '@/types';



/**
 * A hook for managing teams data and operations
 */

export function useTeams(): UseTeamsReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref for loading state check
  const isLoadingRef = useRef(false);

  // Function to load teams
  const loadTeams = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await teamClient.fetchTeams();
      setTeams(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // Load teams on mount
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Create a team
  const createTeam = useCallback(async (data: TeamCreateData): Promise<{ team: Team; wasExisting: boolean }> => {
    setIsCreating(true);
    setError(null);
    
    try {
      // First check if a team with these players exists
      const existingTeam = await teamClient.findExistingTeamWithPlayers(data.playerIds);
      
      if (existingTeam) {
        // Update player ratings if provided
        if (data.playerRatings) {
          await Promise.all(
            data.playerIds.map((id, index) => 
              teamClient.updatePlayerRating(id, data.playerRatings![index])
            )
          );
        }
        return { team: existingTeam, wasExisting: true };
      }

      // Create new team if no existing team found
      const newTeam = await teamClient.createTeam(data);
      
      // Update player ratings if provided
      if (data.playerRatings) {
        await Promise.all(
          data.playerIds.map((id, index) => 
            teamClient.updatePlayerRating(id, data.playerRatings![index])
          )
        );
      }

      await loadTeams(); // Refresh the teams list
      return { team: newTeam.team, wasExisting: false };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [loadTeams]);

  // Delete a team
  const deleteTeam = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await teamClient.deleteTeam(id);
      // Update the teams list
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Update a team
  const updateTeam = useCallback(async (id: string, teamData: TeamUpdateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedTeam = await teamClient.updateTeam(id, teamData.name);
      
      // Update the teams list
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === id ? updatedTeam : team
        )
      );
      
      return updatedTeam;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a team by ID
  const getTeamById = useCallback(async (id: string): Promise<Team> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to find the team in the existing state
      const existingTeam = teams.find(team => team.id === id);
      
      if (existingTeam) {
        return existingTeam;
      }
      
      // If not found in state, fetch it directly
      const teamData = await teamClient.fetchTeam(id);
      
      // Update the teams list with the fetched team
      setTeams(prevTeams => {
        const teamIndex = prevTeams.findIndex(t => t.id === id);
        if (teamIndex >= 0) {
          // Replace the existing team
          const newTeams = [...prevTeams];
          newTeams[teamIndex] = teamData;
          return newTeams;
        } else {
          // Add the new team
          return [...prevTeams, teamData];
        }
      });
      
      return teamData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [teams]);

  return {
    teams,
    isLoading,
    isCreating,
    isDeleting,
    error,
    loadTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    refreshTeams: loadTeams
  };
} 