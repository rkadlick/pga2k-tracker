import { NextRequest, NextResponse } from 'next/server';
import { checkTeamNameExists } from '@/lib/teamService';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }
    
    const exists = await checkTeamNameExists(name);
    return NextResponse.json({ data: { exists } });
  } catch (error) {
    console.error('Error checking team name:', error);
    return NextResponse.json(
      { error: 'Failed to check team name' },
      { status: 500 }
    );
  }
} 