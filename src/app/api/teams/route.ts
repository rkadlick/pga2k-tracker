import { NextRequest, NextResponse } from 'next/server';
import { getTeams, createTeam } from '@/lib/teamService'
import { validateTeamData } from '@/lib/validation/teamValidation';

export async function GET() {
  try {
    const teams = await getTeams();
    console.log('teams', teams);
    return NextResponse.json({ data: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const teamData = await request.json();
    
    // Validate team data
    const validationErrors = validateTeamData(teamData);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }
    
    const team = await createTeam(teamData);
    return NextResponse.json({ data: team });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
} 