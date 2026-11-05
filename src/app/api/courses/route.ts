import { NextResponse } from 'next/server';
import { getCourses } from '@/lib/courseService';

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json({ data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
