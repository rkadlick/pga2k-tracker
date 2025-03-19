import { createClient } from '@/utils/supabase/server';
import { Match, HoleResultRecord, HoleResult, NinePlayed } from '@/types';

/**
 * Get all matches with related information
 */
export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  
  // Get matches with course and team information
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, 
      date_played,
      course_id,
      courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      nine_played,
      your_team_score,
      opponent_team_score,
      winner_id,
      score_description,
      margin,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .order('date_played', { ascending: false });
  if (error) throw error;
  
  // Transform data to match the expected format
  return data.map(match => ({
    ...match,
    course_name: match.courses?.name || '',
    your_team_name: match.your_team?.name || '',
    opponent_team_name: match.opponent_team?.name || ''
  }));
}

/**
 * Get a single match by ID with all related data
 */
export async function getMatchWithDetails(id: string): Promise<Match> {
  const supabase = await createClient();
  
  // Get the match with related course and team information
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select(`
      id, 
      date_played,
      course_id,
      courses(id, name),
      your_team_id,
      your_team:teams!your_team_id(id, name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(id, name),
      nine_played,
      your_team_score,
      opponent_team_score,
      winner_id,
      score_description,
      margin,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .single();
  
  if (matchError) throw matchError;
  
  // Get hole results for this match
  const { data: holeResults, error: holeResultsError } = await supabase
    .from('hole_results')
    .select('*')
    .eq('match_id', id)
    .order('hole_number');
  
  if (holeResultsError) throw holeResultsError;
  
  // Transform data to match the expected format
  return {
    ...match,
    course_name: match.courses?.name || '',
    your_team_name: match.your_team?.name || '',
    opponent_team_name: match.opponent_team?.name || '',
    hole_results: holeResults || []
  };
}

/**
 * Create a new match
 */
export async function createMatch(matchData: {
  date_played: string;
  course_id: string;
  your_team_id: string;
  opponent_team_id: string;
  nine_played: NinePlayed;
  your_team_score: number;
  opponent_team_score: number;
  winner_id: string | null;
  score_description?: string;
  margin?: number;
  playoffs: boolean;
  notes?: string;
  tags?: string[];
}): Promise<Match> {
  const supabase = await createClient();
  
  // Insert the match
  const { data, error } = await supabase
    .from('matches')
    .insert([matchData])
    .select(`
      id, 
      date_played,
      course_id,
      courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      nine_played,
      your_team_score,
      opponent_team_score,
      winner_id,
      score_description,
      margin,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .single();
  
  if (error) throw error;
  
  // Transform data to match the expected format
  return {
    ...data,
    course_name: data.courses?.name || '',
    your_team_name: data.your_team?.name || '',
    opponent_team_name: data.opponent_team?.name || ''
  };
}

/**
 * Update an existing match
 */
export async function updateMatch(
  id: string,
  matchData: Partial<{
    date_played: string;
    course_id: string;
    your_team_id: string;
    opponent_team_id: string;
    nine_played: NinePlayed;
    your_team_score: number;
    opponent_team_score: number;
    winner_id: string | null;
    score_description: string;
    margin: number;
    playoffs: boolean;
    notes: string;
    tags: string[];
  }>
): Promise<Match> {
  const supabase = await createClient();
  
  // Add updated_at timestamp
  const dataWithTimestamp = {
    ...matchData,
    updated_at: new Date().toISOString()
  };
  
  // Update the match
  const { data, error } = await supabase
    .from('matches')
    .update(dataWithTimestamp)
    .eq('id', id)
    .select(`
      id, 
      date_played,
      course_id,
      courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      nine_played,
      your_team_score,
      opponent_team_score,
      winner_id,
      score_description,
      margin,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .single();
  
  if (error) throw error;
  
  // Transform data to match the expected format
  return {
    ...data,
    course_name: data.courses?.name || '',
    your_team_name: data.your_team?.name || '',
    opponent_team_name: data.opponent_team?.name || ''
  };
}

/**
 * Delete a match
 */
export async function deleteMatch(id: string): Promise<void> {
  const supabase = await createClient();
  
  // First delete any hole results associated with this match
  const { error: holeResultsError } = await supabase
    .from('hole_results')
    .delete()
    .eq('match_id', id);
  
  if (holeResultsError) throw holeResultsError;
  
  // Then delete the match
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

/**
 * Add hole results to a match
 */
export async function addHoleResults(
  matchId: string,
  holeResults: Array<{
    hole_number: number;
    result: HoleResult;
  }>
): Promise<HoleResultRecord[]> {
  const supabase = await createClient();
  
  // Prepare hole results with match_id
  const holeResultsWithMatchId = holeResults.map(result => ({
    match_id: matchId,
    hole_number: result.hole_number,
    result: result.result
  }));
  
  // Insert the hole results
  const { data, error } = await supabase
    .from('hole_results')
    .insert(holeResultsWithMatchId)
    .select();
  
  if (error) throw error;
  
  return data;
}

/**
 * Update a hole result
 */
export async function updateHoleResult(
  id: string,
  result: HoleResult
): Promise<HoleResultRecord> {
  const supabase = await createClient();
  
  // Update the hole result
  const { data, error } = await supabase
    .from('hole_results')
    .update({ 
      result,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
}

/**
 * Delete a hole result
 */
export async function deleteHoleResult(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('hole_results')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

/**
 * Create a match with hole results in one operation
 */
export async function createMatchWithHoleResults(
  matchData: {
    date_played: string;
    course_id: string;
    your_team_id: string;
    opponent_team_id: string;
    your_team_score: number;
    opponent_team_score: number;
    winner_id: string | null;
    score_description?: string;
  },
  holeResults: Array<{
    hole_number: number;
    result: HoleResult;
  }>
): Promise<Match> {
  const supabase = await createClient();
  
  // Start a transaction
  try {
    // First create the match
    const match = await createMatch(matchData);
    
    // Then add the hole results if any
    if (holeResults && holeResults.length > 0) {
      await addHoleResults(match.id, holeResults);
    }
    
    // Return the complete match with hole results
    return await getMatchWithDetails(match.id);
  } catch (error) {
    // If an error occurs, attempt to clean up (won't work if the match wasn't created)
    try {
      if (error instanceof Error && error.message.includes('match')) {
        // Get match id from error message if possible
        const idMatch = error.message.match(/match with id ([a-f0-9-]+)/i);
        if (idMatch && idMatch[1]) {
          await deleteMatch(idMatch[1]);
        }
      }
    } catch {
      // Ignore cleanup errors
    }
    
    throw error;
  }
} 