import { NextRequest, NextResponse } from 'next/server';
import { getMatchWithDetails } from '@/lib/matchService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await getMatchWithDetails(id);
    
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: match });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 });
  }
}
