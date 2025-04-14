import { createClient } from '@/utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { Match, HoleResultRecord, HoleResult, NinePlayed } from '@/types';

interface RawMatchResponse {
  id: string;
  date_played: string;
  course_id: string;
  course: { name: string };
  your_team_id: string;
  your_team: { name: string };
  opponent_team_id: string;
  opponent_team: { name: string };
  player1_id: string;
  player1: { name: string };
  player1_rating: number;
  player2_id: string;
  player2: { name: string };
  player2_rating: number;
  opponent1_id: string;
  opponent1: { name: string };
  opponent1_rating: number;
  opponent2_id: string;
  opponent2: { name: string };
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
  created_at: string;
  updated_at: string;
}

interface RawMatchInsertResponse {
  id: string;
  date_played: string;
  course_id: string;
  courses: { name: string }; // Note: this is different from the previous 'course'
  your_team_id: string;
  your_team: { name: string };
  opponent_team_id: string;
  opponent_team: { name: string };
  player1_id: string;
  player1_rating: number;
  player2_id: string;
  player2_rating: number;
  opponent1_id: string;
  opponent1_rating: number;
  opponent2_id: string;
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
  created_at: string;
  updated_at: string;
}

/**
 * Get all matches with related information
 */
export async function getMatches(): Promise<Match[]> {
  const supabase = await createClient();
  
  // Get matches with course, team, and player information
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, 
      date_played,
      course_id,
      course:courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      player1_id,
      player1:players!player1_id(name),
      player1_rating,
      player2_id,
      player2:players!player2_id(name),
      player2_rating,
      opponent1_id,
      opponent1:players!opponent1_id(name),
      opponent1_rating,
      opponent2_id,
      opponent2:players!opponent2_id(name),
      opponent2_rating,
      nine_played,
      holes_won,
      holes_tied,
      holes_lost,
      winner_id,
      rating_change,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at,
      hole_results:hole_results(
        id,
        hole_number,
        result,
        created_at,
        updated_at
      )
    `)
    .order('date_played', { ascending: false }) as { 
      data: RawMatchResponse[] | null, 
      error: PostgrestError | null
    };
  if (error) throw error;
  if (!data) return [];
  // Transform data to match the expected format

  return data.map(match => ({
    ...match,
    course: match.course.name,
    your_team: match.your_team.name,
    opponent_team: match.opponent_team.name, 
    player1_name: match.player1.name,
    player2_name: match.player2.name,
    opponent1_name: match.opponent1.name,
    opponent2_name: match.opponent2.name
  }));
}

/**
 * Get a single match by ID with all related data
 */
export async function getMatchWithDetails(id: string): Promise<Match> {
  const supabase = await createClient();
  
  // Get the match with related course, team, and player information
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select(`
      id, 
      date_played,
      course_id,
      course:courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      player1_id,
      player1:players!player1_id(name),
      player1_rating,
      player2_id,
      player2:players!player2_id(name),
      player2_rating,
      opponent1_id,
      opponent1:players!opponent1_id(name),
      opponent1_rating,
      opponent2_id,
      opponent2:players!opponent2_id(name),
      opponent2_rating,
      nine_played,
      holes_won,
      holes_tied,
      holes_lost,
      winner_id,
      rating_change,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .single() as { 
      data: RawMatchResponse | null, 
      error: PostgrestError | null
    };
  
  if (matchError) throw matchError;
  if (!match) throw new Error('Match not found');
  
  // Get hole results for this match
  const { data: holeResults, error: holeResultsError } = await supabase
    .from('hole_results')
    .select('*')
    .eq('match_id', id)
    .order('hole_number') as {
      data: HoleResultRecord[] | null,
      error: PostgrestError | null
    };
  
  if (holeResultsError) throw holeResultsError;
  
  // Transform data to match the expected format
  return {
    ...match,
    course: match.course.name,
    your_team: match.your_team.name,
    opponent_team: match.opponent_team.name,
    player1_name: match.player1.name,
    player2_name: match.player2.name,
    opponent1_name: match.opponent1.name,
    opponent2_name: match.opponent2.name,
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
  player1_id: string;
  player1_rating: number;
  player2_id: string;
  player2_rating: number;
  opponent1_id: string;
  opponent1_rating: number;
  opponent2_id: string;
  opponent2_rating: number;
  nine_played: NinePlayed;
  holes_won: number;
  holes_tied: number;
  holes_lost: number;
  winner_id: string | null;
  rating_change?: number;
  playoffs: boolean;
  notes?: string;
  tags?: string[];
  hole_results?: HoleResultRecord[];
}): Promise<Match> {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  const dataWithTimestamps = {
    ...matchData,
    created_at: now,
    updated_at: now
  };

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert([dataWithTimestamps])
    .select(`
      id, 
      date_played,
      course_id,
      courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      player1_id,
      player1_rating,
      player2_id,
      player2_rating,
      opponent1_id,
      opponent1_rating,
      opponent2_id,
      opponent2_rating,
      nine_played,
      holes_won,
      holes_tied,
      holes_lost,
      winner_id,
      rating_change,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .single() as {
      data: RawMatchInsertResponse | null,
      error: PostgrestError | null
    };
  
  if (matchError) throw matchError;
  if (!match) throw new Error('Failed to create match');
  
  // Create hole results if provided
  if (matchData.hole_results && matchData.hole_results.length > 0) {
    const holeResultsWithMatchId = matchData.hole_results.map(hr => ({
      ...hr,
      match_id: match.id,
      created_at: now,
      updated_at: now
    }));
    
    const { error: holeResultsError } = await supabase
      .from('hole_results')
      .insert(holeResultsWithMatchId) as {
        error: PostgrestError | null
      };
    
    if (holeResultsError) throw holeResultsError;
  }
  
  // Transform data to match the expected format
  return {
    ...match,
    course: match.courses.name, // Note the change from course to courses
    your_team: match.your_team.name,
    opponent_team: match.opponent_team.name,
    player1_name: '', // or you might want to fetch these separately
    player2_name: '',
    opponent1_name: '',
    opponent2_name: '',
    hole_results: matchData.hole_results || []
  } as Match; // Add type assertion to Match if needed
}


/**
 * Update an existing match
 */
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
    player1_id: string;
    player1_rating: number;
    player2_id: string;
    player2_rating: number;
    opponent1_id: string;
    opponent1_rating: number;
    opponent2_id: string;
    opponent2_rating: number;
    nine_played: NinePlayed;
    holes_won: number;
    holes_tied: number;
    holes_lost: number;
    winner_id: string | null;
    rating_change: number;
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
      course:courses(name),
      your_team_id,
      your_team:teams!your_team_id(name),
      opponent_team_id,
      opponent_team:teams!opponent_team_id(name),
      player1_id,
      player1_rating,
      player2_id,
      player2_rating,
      opponent1_id,
      opponent1_rating,
      opponent2_id,
      opponent2_rating,
      nine_played,
      holes_won,
      holes_tied,
      holes_lost,
      winner_id,
      rating_change,
      playoffs,
      notes,
      tags,
      created_at,
      updated_at
    `)
    .single() as {
      data: RawMatchResponse | null,
      error: PostgrestError | null
    };
  
  if (error) throw error;
  if (!data) throw new Error('Match not found');
  
  // Transform data to match the expected format
  return {
    ...data,
    course: data.course.name,
    your_team: data.your_team.name,
    opponent_team: data.opponent_team.name,
    player1_name: '', // or fetch separately if needed
    player2_name: '',
    opponent1_name: '',
    opponent2_name: '',
    hole_results: [] // You might want to fetch these separately if needed
  } as Match;
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
export async function updateHoleResults(
  matchId: string,
  holeResults: Array<{
    hole_number: number;
    result: HoleResult;
  }>
): Promise<HoleResultRecord[]> {
  const supabase = await createClient();
  
  // First delete existing hole results for this match
  await supabase
    .from('hole_results')
    .delete()
    .eq('match_id', matchId);

  // Then insert the new hole results
  const { data, error } = await supabase
    .from('hole_results')
    .insert(
      holeResults.map(hr => ({
        match_id: matchId,
        hole_number: hr.hole_number,
        result: hr.result
      }))
    )
    .select();

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