import { NextRequest, NextResponse } from 'next/server';
import { getTeamPlayers } from '@/lib/teamService';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const players = await getTeamPlayers(id);
    return NextResponse.json({ data: players });
  } catch (error) {
    console.error('Error fetching team players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team players' },
      { status: 500 }
    );
  }
} 