import { NextRequest, NextResponse } from 'next/server';
import { findTeamByPlayers } from '@/lib/teamService';

export async function GET(request: NextRequest) {
  try {
    const playerIds = request.nextUrl.searchParams.get('playerIds')?.split(',') || [];
    
    if (playerIds.length !== 2) {
      return NextResponse.json(
        { error: 'Exactly two player IDs are required' },
        { status: 400 }
      );
    }

    const team = await findTeamByPlayers(playerIds);
    return NextResponse.json({ data: team });
  } catch (error) {
    console.error('Error finding team by players:', error);
    return NextResponse.json(
      { error: 'Failed to find team' },
      { status: 500 }
    );
  }
} 