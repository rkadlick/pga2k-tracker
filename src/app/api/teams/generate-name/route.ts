import { NextResponse } from 'next/server';
import { generateTeamName } from '@/lib/teamService';

export async function GET() {
  try {
    const name = generateTeamName();
    return NextResponse.json({ data: { name } });
  } catch (error) {
    console.error('Error generating team name:', error);
    return NextResponse.json({ error: 'Failed to generate team name' }, { status: 500 });
  }
} 