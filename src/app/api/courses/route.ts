// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCourse, getCourses } from '@/lib/courseService';

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

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Course name is required' },
        { status: 400 }
      );
    }
    
    const course = await createCourse(name);
    return NextResponse.json({ data: course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
