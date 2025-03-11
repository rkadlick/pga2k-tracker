// src/lib/courseService.ts
import { supabase } from '@/lib/supabase';
import { Course, Hole } from '@/types';

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getCourseWithHoles(id: string): Promise<Course> {
  // Get course
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
  const { data, error } = await supabase
    .from('courses')
    .insert([{ name: courseName }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, courseName: string): Promise<Course> {
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
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addHole(hole: Omit<Hole, 'id' | 'created_at'>): Promise<Hole> {
  const { data, error } = await supabase
    .from('holes')
    .insert([hole])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateHole(id: string, hole: Partial<Hole>): Promise<Hole> {
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
  const { error } = await supabase
    .from('holes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
