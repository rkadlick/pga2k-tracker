import { createClient } from '@/utils/supabase/server';
import { Player } from '@/types';

interface PlayerCreateData {
  name: string;
  recent_rating: number;
}

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