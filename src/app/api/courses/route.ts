import { NextResponse } from 'next/server';
import { createCourseWithHoles, getCourses } from '@/lib/courseService';

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

export async function POST(request: Request) {
  try {
    const { name, holes } = await request.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Course name is required' },
        { status: 400 }
      );
    }
    
    if (!holes || !Array.isArray(holes) || holes.length !== 18) {
      return NextResponse.json(
        { error: 'Valid data for all 18 holes is required' },
        { status: 400 }
      );
    }
    
    // Validate hole data
    for (const hole of holes) {
      if (!hole.hole_number || hole.par < 2 || hole.par > 6 || hole.distance <= 0) {
        return NextResponse.json(
          { error: 'Invalid hole data: par must be 2-6 and distance must be positive' },
          { status: 400 }
        );
      }
    }
    
    const course = await createCourseWithHoles(name, holes);
    
    return NextResponse.json({ data: course });
  } catch (error) {
    console.error('Error creating course with holes:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
