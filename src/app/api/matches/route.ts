// src/app/api/matches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMatches, createMatch } from '@/lib/matchService';
import { validateMatchData } from '@/lib/validation/matchValidation';

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({ data: matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const matchData = await request.json();
    
    // Validate match data
    const validationErrors = validateMatchData(matchData);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }
    
    // Create match
    const match = await createMatch({
      date_played: matchData.date_played,
      course_id: matchData.course_id,
      your_team_id: matchData.your_team_id,
      opponent_team_id: matchData.opponent_team_id,
      nine_played: matchData.nine_played,
      your_team_score: matchData.your_team_score,
      opponent_team_score: matchData.opponent_team_score,
      winner_id: matchData.winner_id,
      score_description: matchData.score_description,
      margin: matchData.margin,
      playoffs: matchData.playoffs || false,
      notes: matchData.notes,
      tags: matchData.tags,
      hole_results: matchData.hole_results
    });
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}
