import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, HoleResult, HoleResultRecord, MatchCreateData, MatchUpdateData } from '@/types';
import * as matchClient from '@/lib/api/matchClient';
import { usePlayers } from '@/hooks/usePlayers';  

/**
 * A hook for managing matches data and operations
 */
export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref for isLoading checks to avoid dependency cycles
  const isLoadingRef = useRef(false);
  
  const { updatePlayerRatings } = usePlayers();

  // Function to load matches
  const loadMatches = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await matchClient.fetchMatches();
      setMatches(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, []); // No dependencies needed now

  // Load matches on mount
  useEffect(() => {
    loadMatches().catch(error => {
      console.error('Failed to load matches:', error);
    });
  }, [loadMatches]);

  // Create a match
  const createMatch = useCallback(async (matchData: MatchCreateData) => {
    setIsCreating(true);
    setError(null);

    try {
      // Extract hole results and player data from match data
      const { hole_results, ...basicMatchData } = matchData;
      
      // Create the match
      const newMatch = await matchClient.createMatch(basicMatchData);
      console.log('newMatch', newMatch);
      
      // Add hole results if they exist
      if (hole_results && hole_results.length > 0) {
        const holeResultsWithTimestamp = hole_results.map(result => ({
          ...result,
          updated_at: new Date().toISOString()
        }));
        await matchClient.addHoleResults(newMatch.id, holeResultsWithTimestamp as Omit<HoleResultRecord, "id" | "created_at">[]);
      }

      // Update player ratings if there's a rating change  
      if (matchData.rating_change !== 0) {
        await updatePlayerRatings(matchData.player1_id, matchData.player2_id, matchData.rating_change);
      }
      
      // Fetch the complete match with hole results
      const completeMatch = await matchClient.fetchMatch(newMatch.id);
      console.log('completeMatch', completeMatch);
      // Update the matches list
      setMatches(prev => [completeMatch, ...prev]);
      
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
        const holeResultsWithTimestamp = hole_results.map(result => ({
          ...result,
          updated_at: new Date().toISOString()
        }));
        await matchClient.updateHoleResults(id, holeResultsWithTimestamp as Omit<HoleResultRecord, "id" | "created_at">[]);
      }

      if(matchData.recent_rating_change !== 0) {
        await updatePlayerRatings(matchData.player1_id, matchData.player2_id, matchData.recent_rating_change);
      }
      
      // Update the matches list
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === id ? {...updatedMatch} : match
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
  }, [updatePlayerRatings]);

  // Get a match by ID
  const getMatchById = useCallback(async (id: string): Promise<Match> => {
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
          // Create a new array with the updated match
          return prevMatches.map((match, index) => 
            index === matchIndex 
              ? { ...match, ...matchData } // Merge existing match with new data
              : match
          );
        } else {
          // Add new match to the array
          return [...prevMatches, matchData];
        }
      });
      
      
      return matchData;
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
      // Add match_id and updated_at to each hole result
      const holeResultsWithMatchId = holeResults.map(result => ({
        ...result,
        match_id: matchId,
        updated_at: new Date().toISOString()
      }));
      
      await matchClient.addHoleResults(matchId, holeResultsWithMatchId);
      // Refresh the match to get updated data
      const updatedMatch = await matchClient.fetchMatch(matchId);
      
      // Update the matches list
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === matchId ? updatedMatch : match
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
          match.id === matchId ? updatedMatch : match
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