import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const playerIds = request.nextUrl.searchParams.get('playerIds')?.split(',') || [];
    
    if (playerIds.length !== 2) {
      return NextResponse.json(
        { error: 'Exactly two player IDs are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get all teams that have either of these players
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('team_id, player_id')
      .in('player_id', playerIds);

    if (membersError) throw membersError;
    if (!teamMembers) return NextResponse.json({ data: null });

    // Group team members by team_id
    const teamMembersByTeam = teamMembers.reduce((acc, tm) => {
      acc[tm.team_id] = [...(acc[tm.team_id] || []), tm.player_id];
      return acc;
    }, {} as Record<string, string[]>);

    // Find a team that has exactly these two players
    const matchingTeamId = Object.entries(teamMembersByTeam)
      .find(([, members]) => 
        members.length === 2 && 
        members.every(id => playerIds.includes(id))
      )?.[0];

    if (!matchingTeamId) {
      return NextResponse.json({ data: null });
    }

    // Get the team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', matchingTeamId)
      .single();

    if (teamError) throw teamError;
    
    return NextResponse.json({ data: team });
  } catch (error) {
    console.error('Error finding team by players:', error);
    return NextResponse.json(
      { error: 'Failed to find team' },
      { status: 500 }
    );
  }
} 