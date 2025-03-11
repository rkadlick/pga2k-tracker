// src/app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCourseWithHoles, updateCourse, deleteCourse } from '@/lib/courseService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await getCourseWithHoles(params.id);
    return NextResponse.json({ data: course });
  } catch (error) {
    console.error(`Error fetching course ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Course name is required' },
        { status: 400 }
      );
    }
    
    const course = await updateCourse(params.id, name);
    return NextResponse.json({ data: course });
  } catch (error) {
    console.error(`Error updating course ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCourse(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting course ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
