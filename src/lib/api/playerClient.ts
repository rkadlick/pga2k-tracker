import { ApiResponse, formatError } from './errorHandling';
import { Player } from '@/types';


/**
 * Update player ratings based on a match result
 */
export async function updatePlayerRatings(
  player1_id: string,
  player2_id: string,
  rating_change: number
): Promise<void> {
  try {
    const response = await fetch(`/api/players`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1_id, player2_id, rating_change }),
    });
    
    const result = await response.json() as ApiResponse<void>;

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update player ratings');
    }
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Get a player by ID
 */
export async function getPlayer(playerId: string): Promise<Player> {
  try {
    const response = await fetch(`/api/players/${playerId}`);
    const result = await response.json() as ApiResponse<Player>;

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch player');
    }

    return result.data;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Update a player's details
 */
export async function updatePlayer(playerId: string, playerData: Partial<Player>): Promise<Player> {
  try {
    const response = await fetch(`/api/players/${playerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData),
    });
    
    const result = await response.json() as ApiResponse<Player>;

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update player');
    }

    return result.data;
  } catch (error) {
    throw formatError(error).error;
  }
} 