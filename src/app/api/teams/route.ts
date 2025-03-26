import { NextResponse } from 'next/server';
import { createTeam, getTeams } from '@/lib/teamService';
import { validateTeamName, validateHoles, hasValidationErrors } from '@/lib/validation/teamValidation';


export async function GET() {
  try {
    const teams = await getTeams();
    return NextResponse.json({ data: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}