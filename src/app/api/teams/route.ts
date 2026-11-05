import { NextResponse } from 'next/server';
import { getTeams } from '@/lib/teamService';

export async function GET() {
  try {
    const teams = await getTeams();
    return NextResponse.json({ data: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
