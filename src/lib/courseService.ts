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
  holes: Array<{ hole_number: number; par: number; distance: number }>
): Promise<Course> {
  const supabase = await createClient();
  
  // First create the course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert([{ name: courseName }])
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
