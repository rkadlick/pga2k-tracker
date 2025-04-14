import { NextRequest, NextResponse } from 'next/server';
import { getTeamPlayers } from '@/lib/teamService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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