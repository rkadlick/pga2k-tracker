import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { recent_rating } = await request.json();
    const supabase = await createClient();

    const { error } = await supabase
      .from('players')
      .update({ recent_rating })
      .eq('id', id);

    if (error) throw error;
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error updating player rating:', error);
    return NextResponse.json(
      { error: 'Failed to update player rating' },
      { status: 500 }
    );
  }
} 