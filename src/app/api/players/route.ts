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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { player1_id, player2_id, rating_change } = body;

    if (!player1_id || !player2_id || rating_change === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: player1_id, player2_id, or rating_change' },
        { status: 400 }
      );
    }

    // Update both players' ratings
    await playerService.updatePlayerRatings(player1_id, player2_id, rating_change);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating player ratings:', error);
    return NextResponse.json(
      { error: 'Failed to update player ratings' },
      { status: 500 }
    );
  }
} 