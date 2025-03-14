import { createClient } from '@/utils/supabase/server';
import { Course, Hole } from '@/types';

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getCourseWithHoles(id: string): Promise<Course> {
  // Get course
  const supabase = await createClient();
  const { data: course, error: courseError } = await supabase
    .from('courses')  
    .select('*')
    .eq('id', id)
    .single();
  
  if (courseError) throw courseError;
  
  // Get holes
  const { data: holes, error: holesError } = await supabase
    .from('holes')
    .select('*')
    .eq('course_id', id)
    .order('hole_number');
  
  if (holesError) throw holesError;
  
  return {
    ...course,
    holes: holes || []
  };
}

export async function createCourse(courseName: string): Promise<Course> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .insert([{ name: courseName }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, courseName: string): Promise<Course> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .update({ name: courseName, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addHole(hole: Omit<Hole, 'id' | 'created_at'>): Promise<Hole> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('holes')
    .insert([hole])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateHole(id: string, hole: Partial<Hole>): Promise<Hole> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('holes')
    .update(hole)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteHole(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('holes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function createCourseWithHoles(
  courseName: string, 
  holes: Array<{ hole_number: number; par: number; distance: number }>,
  totalPar: number,
  totalDistance: number
): Promise<Course> {
  const supabase = await createClient();
  
  // First create the course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert([{ name: courseName, total_par: totalPar, total_distance: totalDistance}])
    .select()
    .single();
  
  if (courseError) throw courseError;
  
  // Prepare hole data with course_id
  const holesWithCourseId = holes.map(hole => ({
    ...hole,
    course_id: course.id
  }));
  
  console.log('test')
  // Add all holes
  const { data: createdHoles, error: holesError } = await supabase
    .from('holes')
    .insert(holesWithCourseId)
    .select();
    console.log('test1')
    // Add all holes
  if (holesError) {
    // If hole creation fails, try to delete the course to maintain data integrity
    await supabase.from('courses').delete().eq('id', course.id);
    throw holesError;
    console.log('testE')
  // Add all holes
  }
  
  // Return the course with holes
  return {
    ...course,
    holes: createdHoles || []
  };
}

/**
 * Updates a course and its holes
 * @param courseId The ID of the course to update
 * @param courseName The new name for the course
 * @param holes The updated hole data
 * @returns The updated course with holes
 */
export async function updateCourseWithHoles(
  courseId: string,
  courseName: string,
  holes: Array<{ 
    id: string; 
    hole_number: number; 
    par: number | null; 
    distance: number | null;
    course_id: string;
  }>
): Promise<Course> {
  const supabase = await createClient();
  
  // Calculate totals
  const totalPar = holes.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const totalDistance = holes.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  
  // Update the course
  const { error: courseError } = await supabase
    .from('courses')
    .update({ 
      name: courseName,
      total_par: totalPar,
      total_distance: totalDistance,
      updated_at: new Date().toISOString()
    })
    .eq('id', courseId);
  
  if (courseError) throw courseError;
  
  // Update all holes - remove the updated_at field since it doesn't exist in the table
  for (const hole of holes) {
    const { error: holeError } = await supabase
      .from('holes')
      .update({ 
        par: hole.par, 
        distance: hole.distance
      })
      .eq('id', hole.id)
      .eq('course_id', courseId); // Extra safety check
    
    if (holeError) throw holeError;
  }
  
  // Fetch and return the updated course with holes
  return await getCourseWithHoles(courseId);
}
