import { NextRequest, NextResponse } from 'next/server';
import { getCourseWithHoles } from '@/lib/courseService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await getCourseWithHoles(id);
    return NextResponse.json({ data: course });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
