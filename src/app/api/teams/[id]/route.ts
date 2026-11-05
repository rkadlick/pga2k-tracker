import { NextRequest, NextResponse } from 'next/server';
import { getTeam } from '@/lib/teamService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await getTeam(id);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    return NextResponse.json({ data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
