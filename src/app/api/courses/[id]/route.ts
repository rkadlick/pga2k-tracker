import { NextRequest, NextResponse } from 'next/server';
import { getCourseWithHoles, updateCourseWithHoles, deleteCourse } from '@/lib/courseService';
import { validateCourseName, validateHolePar, validateHoleDistance } from '@/lib/validation/courseValidation';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { 
      name, 
      holes, 
      frontPar, 
      backPar, 
      totalPar, 
      frontDistance, 
      backDistance, 
      totalDistance 
    } = await request.json();
    
    // Validate course name
    const nameError = validateCourseName(name);
    if (nameError) {
      return NextResponse.json(
        { error: 'Invalid course name', details: nameError },
        { status: 400 }
      );
    }
    
    // Validate holes if provided
    if (holes && Array.isArray(holes)) {
      const holeErrors = holes.map((hole) => {
        const parError = validateHolePar(hole.par);
        if (parError) return `Hole ${hole.hole_number}: ${parError}`;
        
        const distanceError = validateHoleDistance(hole.distance);
        if (distanceError) return `Hole ${hole.hole_number}: ${distanceError}`;
        
        return '';
      }).filter(error => error);
      
      if (holeErrors.length > 0) {
        return NextResponse.json(
          { error: 'Invalid hole data', details: holeErrors },
          { status: 400 }
        );
      }
    }
    
    // Update course and holes in one operation
    const updatedCourse = await updateCourseWithHoles(
      id, 
      name, 
      holes, 
      frontPar, 
      backPar, 
      totalPar, 
      frontDistance, 
      backDistance, 
      totalDistance
    );
    
    return NextResponse.json({ data: updatedCourse });
  } catch (error) {
    console.error(`Error updating course:`, error);
    return NextResponse.json(
      { error: 'Failed to update course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCourse(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting course:`, error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
