import { NextRequest, NextResponse } from 'next/server';
import { getMatchWithDetails, updateMatch, deleteMatch } from '@/lib/matchService';
import { validateMatchUpdateData } from '@/lib/validation/matchValidation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await getMatchWithDetails(id);
    
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchData = await request.json();
    
    // Validate match update data
    const validationErrors = validateMatchUpdateData(matchData);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }
    
    // Update match
    const updatedMatch = await updateMatch(id, {
      date_played: matchData.date_played,
      course_id: matchData.course_id,
      your_team_id: matchData.your_team_id,
      opponent_team_id: matchData.opponent_team_id,
      nine_played: matchData.nine_played,
      holes_won: matchData.holes_won,
      holes_tied: matchData.holes_tied,
      holes_lost: matchData.holes_lost,
      winner_id: matchData.winner_id,
      rating_change: matchData.rating_change,
      playoffs: matchData.playoffs,
      notes: matchData.notes,
      tags: matchData.tags
    });
    
    if (!updatedMatch) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMatch(id);
    

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 });
  }
} 