import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, HoleResult, NinePlayed } from '@/types';
import * as matchClient from '@/lib/api/matchClient';
import { usePlayers } from '@/hooks/usePlayers';

interface MatchCreateData {
  date_played: string;
  course_id: string;
  your_team_id: string;
  opponent_team_id: string;
  player1_id: string;
  player2_id: string;
  opponent1_id: string;
  opponent2_id: string;
  player1_rating: number;
  player2_rating: number;
  opponent1_rating: number;
  opponent2_rating: number;
  nine_played: NinePlayed;
  holes_won: number;
  holes_tied: number;
  holes_lost: number;
  winner_id: string | null;
  rating_change: number;
  playoffs: boolean;
  notes?: string;
  tags?: string[];
  hole_results?: Array<{
    hole_number: number;
    result: HoleResult;
    match_id?: string;
  }>;
}

interface MatchUpdateData {
  date_played?: string;
  course_id?: string;
  your_team_id?: string;
  opponent_team_id?: string;
  player1_id: string;
  player2_id: string;
  opponent1_id: string;
  opponent2_id: string;
  nine_played?: NinePlayed;
  holes_won?: number;
  holes_tied?: number;
  holes_lost?: number;
  winner_id?: string | null;
  rating_change: number;
  recent_rating_change: number;
  playoffs?: boolean;
  notes?: string;
  tags?: string[];
}

// Extend the Match interface to include hole_results
interface MatchWithDetails extends Match {
  hole_results?: Array<{
    id: string;
    match_id: string;
    hole_number: number;
    result: HoleResult;
    created_at: string;
    updated_at: string;
  }>;
}

/**
 * A hook for managing matches data and operations
 */
export function useMatches() {
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to prevent the effect from running more than once
  const initialized = useRef(false);
  
  const { updatePlayerRatings } = usePlayers();
  
  // Load matches on mount only
  useEffect(() => {
    // Only run once
    if (!initialized.current) {
      loadMatches();
      initialized.current = true;
    }
    
    // No cleanup needed for this effect
  }, []); // Empty dependency array ensures this only runs once

  // Function to load matches
  const loadMatches = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await matchClient.fetchMatches();
      setMatches(data as MatchWithDetails[]);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Create a match
  const createMatch = useCallback(async (matchData: MatchCreateData) => {
    setIsCreating(true);
    setError(null);

    try {
      // Extract hole results and player data from match data
      const { hole_results, ...basicMatchData } = matchData;
      
      // Create the match
      const newMatch = await matchClient.createMatch(basicMatchData);
      
      // Add hole results if they exist
      if (hole_results && hole_results.length > 0) {
        await matchClient.addHoleResults(newMatch.id, hole_results);
      }

      // Update player ratings if there's a rating change
      if (matchData.rating_change !== 0) {
        await updatePlayerRatings(matchData.player1_id, matchData.player2_id, matchData.rating_change);
      }
      
      // Fetch the complete match with hole results
      const completeMatch = await matchClient.fetchMatch(newMatch.id);
      
      // Update the matches list
      setMatches(prev => [completeMatch as MatchWithDetails, ...prev]);
      
      return completeMatch;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [updatePlayerRatings]);

  // Delete a match
  const deleteMatch = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await matchClient.deleteMatch(id);
      // Update the matches list
      setMatches(prev => prev.filter(match => match.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Update a match
  const updateMatch = useCallback(async (id: string, matchData: MatchUpdateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { hole_results, ...basicMatchData } = matchData;

      const updatedMatch = await matchClient.updateMatch(id, basicMatchData);
      
      if (hole_results && hole_results.length > 0) {
        await matchClient.updateHoleResults(id, hole_results);
      }

      if(matchData.recent_rating_change !== 0) {
        await updatePlayerRatings(matchData.player1_id, matchData.player2_id, matchData.recent_rating_change);
      }
      
      // Update the matches list
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === id ? {...updatedMatch as MatchWithDetails} : match
        )
      );
      
      return updatedMatch;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a match by ID
  const getMatchById = useCallback(async (id: string): Promise<MatchWithDetails> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to find the match in the existing state
      const existingMatch = matches.find(match => match.id === id);
      
      // If the match is in state and has hole results, return it
      if (existingMatch && existingMatch.hole_results) {
        return existingMatch;
      }
      
      // If not found in state or doesn't have hole results, fetch it directly
      const matchData = await matchClient.fetchMatch(id);
      
      // Update the matches list with the fetched match
      setMatches(prevMatches => {
        const matchIndex = prevMatches.findIndex(m => m.id === id);
        if (matchIndex >= 0) {
          // Replace the existing match
          const newMatches = [...prevMatches];
          newMatches[matchIndex] = matchData as MatchWithDetails;
          return newMatches;
        } else {
          // Add the new match
          return [...prevMatches, matchData as MatchWithDetails];
        }
      });
      return matchData as MatchWithDetails;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [matches]);

  // Add hole results to a match
  const addHoleResults = useCallback(async (
    matchId: string,
    holeResults: Array<{
      hole_number: number;
      result: HoleResult;
    }>
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add match_id to each hole result
      const holeResultsWithMatchId = holeResults.map(result => ({
        ...result,
        match_id: matchId
      }));
      
      await matchClient.addHoleResults(matchId, holeResultsWithMatchId);
      
      // Refresh the match to get updated data
      const updatedMatch = await matchClient.fetchMatch(matchId);
      
      // Update the matches list
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === matchId ? updatedMatch as MatchWithDetails : match
        )
      );
      
      return updatedMatch;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a hole result
  /*const updateHoleResult = useCallback(async (
    holeResultId: string,
    result: HoleResult,
    matchId: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await matchClient.updateHoleResults(holeResultId, result);
      
      // Refresh the match to get updated data
      const updatedMatch = await matchClient.fetchMatch(matchId);
      
      // Update the matches list
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === matchId ? updatedMatch as MatchWithDetails : match
        )
      );
      
      return updatedMatch as MatchWithDetails;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []); */

  return {
    matches,
    isLoading,
    isCreating,
    isDeleting,
    error,
    loadMatches,
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchById,
    addHoleResults,
    /*updateHoleResult*/
  };
} 