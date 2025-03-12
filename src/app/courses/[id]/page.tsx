'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Hole } from '@/types';
import CourseForm from '@/components/courses/ComprehensiveCourseForm';
import CourseDetail from '@/components/courses/CourseDetail';
import HoleForm from '@/components/courses/HoleForm';

export default function CourseDetailPage({
  params
}: {
  params: { id: string }
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingHole, setIsEditingHole] = useState(false);
  const [currentHole, setCurrentHole] = useState<Hole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${id}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load course');
      }
      
      setCourse(result.data);
    } catch (err) {
      console.error('Error loading course:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async (name: string) => {
    if (!course) return;
    
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update course');
      }
      
      setCourse({ ...course, name });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleAddHole = async (holeData: Omit<Hole, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/holes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holeData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add hole');
      }
      
      // Reload the course to get the updated holes
      await loadCourse();
    } catch (err) {
      console.error('Error adding hole:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleEditHole = (hole: Hole) => {
    setCurrentHole(hole);
    setIsEditingHole(true);
  };

  const handleUpdateHole = async (holeData: Omit<Hole, 'id' | 'created_at'>) => {
    if (!currentHole) return;
    
    try {
      const response = await fetch('/api/holes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentHole.id, ...holeData })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update hole');
      }
      
      // Reload the course to get the updated holes
      await loadCourse();
      setIsEditingHole(false);
      setCurrentHole(null);
    } catch (err) {
      console.error('Error updating hole:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteHole = async (holeId: string) => {
    try {
      const response = await fetch('/api/holes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: holeId })
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete hole');
      }
      
      // Reload the course to get the updated holes
      await loadCourse();
    } catch (err) {
      console.error('Error deleting hole:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => router.push('/courses')}
              className="mt-2 text-sm text-red-700 underline"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Course not found</p>
        <button
          onClick={() => router.push('/courses')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/courses')}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Course
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Edit Course</h2>
          <CourseForm
            initialName={course.name}
            onSubmit={handleUpdateCourse}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : isEditingHole ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Edit Hole</h2>
          <HoleForm
            courseId={course.id}
            initialData={currentHole || undefined}
            onSubmit={handleUpdateHole}
            onCancel={() => {
              setIsEditingHole(false);
              setCurrentHole(null);
            }}
          />
        </div>
      ) : (
        <CourseDetail
          course={course}
          onUpdateHole={handleAddHole}
          onEditHole={handleEditHole}
          onDeleteHole={handleDeleteHole}
        />
      )}
    </div>
  );
}
