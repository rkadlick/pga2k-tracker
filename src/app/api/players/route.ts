import { NextResponse } from 'next/server';
import * as playerService from '@/lib/playerService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const player = await playerService.createPlayer({ 
      name: body.name,
      recent_rating: body.recent_rating
    });
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
} 