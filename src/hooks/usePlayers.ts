import { useState, useCallback } from 'react';
import * as playerClient from '@/lib/api/playerClient';
import { Player } from '@/types';

export function usePlayers() {
  const [isUpdatingRatings, setIsUpdatingRatings] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePlayerRatings = useCallback(async (player1_id: string, player2_id: string, rating_change: number) => {
    setIsUpdatingRatings(true);
    setError(null);

    try {
      await playerClient.updatePlayerRatings(player1_id, player2_id, rating_change);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsUpdatingRatings(false);
    }
  }, []);

  const getPlayer = useCallback(async (playerId: string): Promise<Player> => {
    try {
      return await playerClient.getPlayer(playerId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);

  const updatePlayer = useCallback(async (playerId: string, playerData: Partial<Player>): Promise<Player> => {
    try {
      return await playerClient.updatePlayer(playerId, playerData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);

  return {
    isUpdatingRatings,
    error,
    updatePlayerRatings,
    getPlayer,
    updatePlayer,
  };
} 