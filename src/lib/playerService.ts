import { Player, PlayerCreateData } from '@/types';
import { createClient } from '@/utils/supabase/server';

export async function createPlayer(playerData: PlayerCreateData): Promise<Player> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('players')
    .insert([{ 
      name: playerData.name,
      recent_rating: playerData.recent_rating
    }])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create player');
  return data;
}

export async function updatePlayerRatings(
  player1_id: string,
  player2_id: string,
  rating_change: number
): Promise<void> {
  const supabase = await createClient();

  // Start a transaction by getting both players
  const { data: players, error: fetchError } = await supabase
    .from('players')
    .select('id, recent_rating')
    .in('id', [player1_id, player2_id]);

  if (fetchError) throw fetchError;
  if (!players || players.length !== 2) {
    throw new Error('Could not find both players');
  }

  const player1 = players.find(p => p.id === player1_id);
  const player2 = players.find(p => p.id === player2_id);

  if (!player1 || !player2) {
    throw new Error('Could not find both players');
  }

  // Update player 1 (winner gets positive rating change)
  const { error: error1 } = await supabase
    .from('players')
    .update({ recent_rating: player1.recent_rating + rating_change })
    .eq('id', player1_id);

  if (error1) throw error1;


  const { error: error2 } = await supabase
    .from('players')
    .update({ recent_rating: player2.recent_rating + rating_change })
    .eq('id', player2_id);

  if (error2) throw error2;
}

export async function getPlayer(id: string): Promise<Player> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Player not found');

  return data;
} 