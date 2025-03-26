import { createClient } from '@/utils/supabase/server';
import { Team } from '@/types';

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data || [];
}

