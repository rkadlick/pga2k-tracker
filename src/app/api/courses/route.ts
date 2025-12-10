import { NextResponse } from 'next/server';
import { createCourseWithHoles, getCourses } from '@/lib/courseService';
import { validateCourseName, validateHoles } from '@/lib/validation/courseValidation';
import { HoleData } from '@/types';

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
    const { name, holes, frontPar, backPar, totalPar, frontDistance, backDistance, totalDistance } = await request.json();
    
    // Validate course name
    const courseNameError = validateCourseName(name);
    if (courseNameError) {
      return NextResponse.json(
        { error: courseNameError },
        { status: 400 }
      );
    }

    // Validate holes
    const holeErrors = validateHoles(holes as HoleData[]);
    if (holeErrors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid hole data', details: holeErrors },
        { status: 400 }
      );
    }

    // Validate totals
    if (!totalPar) {
      return NextResponse.json(
        { error: 'Total par is required' },
        { status: 400 }
      );
    }

    if (!totalDistance) {
      return NextResponse.json(
        { error: 'Total distance is required' },
        { status: 400 }
      );
    }
    
    const course = await createCourseWithHoles(name, holes, frontPar, backPar, totalPar, frontDistance, backDistance, totalDistance);
    
    return NextResponse.json({ data: course });
  } catch (error) {
    console.error('Error creating course with holes:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
