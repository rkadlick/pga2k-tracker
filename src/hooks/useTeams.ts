import { useState, useEffect, useCallback, useRef } from 'react';
import { Team, TeamCreateData, TeamUpdateData } from '@/lib/api/teamClient';
import * as teamClient from '@/lib/api/teamClient';

/**
 * A hook for managing teams data and operations
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to prevent the effect from running more than once
  const initialized = useRef(false);
  
  // Load teams on mount only
  useEffect(() => {
    // Only run once
    if (!initialized.current) {
      loadTeams();
      initialized.current = true;
    }
  }, []); // Empty dependency array ensures this only runs once

  // Function to load teams
  const loadTeams = useCallback(async () => {
    if (isLoading) return;
    
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
    }
  }, [isLoading]);

  // Create a team
  const createTeam = useCallback(async (teamData: TeamCreateData) => {
    setIsCreating(true);
    setError(null);
    
    try {
      const newTeam = await teamClient.createTeam(teamData);
      
      // Update the teams list
      setTeams(prev => [newTeam, ...prev]);
      
      return newTeam;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

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
      const updatedTeam = await teamClient.updateTeam(id, teamData);
      
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
    getTeamById
  };
} 