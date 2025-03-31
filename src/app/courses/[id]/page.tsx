'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Hole } from '@/types';
import Scorecard from '@/components/common/Scorecard';
import { validateCourseName, validateHolePar, validateHoleDistance } from '@/lib/validation/courseValidation';
import { useCourses } from '@/hooks/useCourses';
import EditCourseHoles from '@/components/courses/EditCourseHoles';
import { use } from 'react';

interface HoleData {
  id: string;
  hole_number: number;
  par: number | null;
  distance: number | null;
  course_id: string;
}

const inputStyles = `
  /* Remove arrows from number inputs */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

export default function CourseDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [holes, setHoles] = useState<HoleData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('');
  const [nameError, setNameError] = useState('');
  const [holeErrors, setHoleErrors] = useState<string[]>([]);
  
  const router = useRouter();
  const { updateCourse } = useCourses();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        const data = await response.json();
        setCourse(data.data);
        // Convert holes to match the HoleData interface
        const convertedHoles = (data.data.holes || []).map((hole: Hole): HoleData => ({
          id: hole.id,
          hole_number: hole.hole_number,
          par: hole.par,
          distance: hole.distance ?? null,
          course_id: hole.course_id
        }));
        setHoles(convertedHoles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to fetch course');
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course) {
      setCourseName(course.name);
      // Convert holes to match the HoleData interface
      const convertedHoles = (course.holes || []).map((hole: Hole): HoleData => ({
        id: hole.id,
        hole_number: hole.hole_number,
        par: hole.par,
        distance: hole.distance ?? null,
        course_id: hole.course_id
      }));
      setHoles(convertedHoles);
      setNameError('');
      setHoleErrors([]);
    }
  }, [course]);

  const handleUpdateCourse = async () => {
    // Validate course name
    const nameValidationError = validateCourseName(courseName);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    // Validate holes
    const newHoleErrors = holes.map(hole => {
      const parError = validateHolePar(hole.par);
      if (parError) return `Hole ${hole.hole_number}: ${parError}`;
      
      const distanceError = validateHoleDistance(hole.distance);
      if (distanceError) return `Hole ${hole.hole_number}: ${distanceError}`;
      
      return '';
    }).filter(error => error);

    if (newHoleErrors.length > 0) {
      setHoleErrors(newHoleErrors);
      return;
    }

    // Calculate front/back/total values
    const frontNine = holes.filter(h => h.hole_number <= 9);
    const backNine = holes.filter(h => h.hole_number > 9);
    
    const frontPar = frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
    const backPar = backNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
    const totalPar = frontPar + backPar;
    
    const frontDistance = frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
    const backDistance = backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
    const totalDistance = frontDistance + backDistance;

    try {
      // Use the updateCourse function from the hook
      const updatedCourse = await updateCourse(
        id,
        courseName,
        holes,
        frontPar,
        backPar,
        totalPar,
        frontDistance,
        backDistance,
        totalDistance
      );
      
      setCourse(updatedCourse);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (course) {
      setCourseName(course.name);
      // Convert holes to match the HoleData interface
      const convertedHoles = (course.holes || []).map((hole: Hole): HoleData => ({
        id: hole.id,
        hole_number: hole.hole_number,
        par: hole.par,
        distance: hole.distance ?? null,
        course_id: hole.course_id
      }));
      setHoles(convertedHoles);
      setNameError('');
      setHoleErrors([]);
    }
    setIsEditing(false);
  };

  const updateHole = (holeNumber: number, field: 'par' | 'distance', value: number | null) => {
    setHoles(prevHoles => 
      prevHoles.map(hole => 
        hole.hole_number === holeNumber 
          ? { ...hole, [field]: value }
          : hole
      )
    );
    // Clear any existing error for this hole
    setHoleErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[holeNumber - 1] = '';
      return newErrors;
    });
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

  // Prepare data for scorecard
  const frontNine = holes.filter(h => h.hole_number <= 9).sort((a, b) => a.hole_number - b.hole_number);
  const backNine = holes.filter(h => h.hole_number > 9).sort((a, b) => a.hole_number - b.hole_number);
  
  const frontNinePar = frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const backNinePar = backNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const totalPar = frontNinePar + backNinePar;
  
  const frontNineDistance = frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const backNineDistance = backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const totalDistance = frontNineDistance + backNineDistance;

  return (
    <div className="space-y-6">
      <style jsx global>{inputStyles}</style>
      
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
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Course
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCourse}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
      
      {/* Course Name */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        {isEditing ? (
          <div>
            <label htmlFor="courseName" className="block text-lg font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                setNameError('');
              }}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg ${
                nameError ? 'border-red-300' : ''
              }`}
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
            )}
          </div>
        ) : (
          <h2 className="text-xl font-bold">{course.name}</h2>
        )}
      </div>
      
      {/* Course Holes */}
      {isEditing ? (
        <EditCourseHoles
          holes={holes}
          onHoleUpdate={updateHole}
          holeErrors={holeErrors}
        />
      ) : (
        <>
          {/* Front Nine */}
          <Scorecard 
            title="Front Nine"
            columns={[
              { id: 'label', label: '' },
              ...frontNine.map(hole => ({ 
                id: `hole-${hole.hole_number}`,
                label: hole.hole_number.toString()
              }))
            ]}
            rows={[
              {
                id: 'frontPar',
                type: 'par',
                label: 'Par',
                values: frontNine.map(hole => hole.par?.toString() || ''),
                total: frontNinePar
              },
              {
                id: 'frontDistance',
                type: 'distance',
                label: 'Yards',
                values: frontNine.map(hole => hole.distance?.toString() || ''),
                total: frontNineDistance
              }
            ]}
          />
          
          {/* Back Nine */}
          <Scorecard 
            title="Back Nine"
            columns={[
              { id: 'label', label: '' },
              ...backNine.map(hole => ({ 
                id: `hole-${hole.hole_number}`,
                label: hole.hole_number.toString()
              }))
            ]}
            rows={[
              {
                id: 'backPar',
                type: 'par',
                label: 'Par',
                values: backNine.map(hole => hole.par?.toString() || ''),
                total: backNinePar
              },
              {
                id: 'backDistance',
                type: 'distance',
                label: 'Yards',
                values: backNine.map(hole => hole.distance?.toString() || ''),
                total: backNineDistance
              }
            ]}
          />
        </>
      )}
      
      {/* Course Totals */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Course Totals</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Par</p>
            <p className="font-medium">{totalPar}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Yards</p>
            <p className="font-medium">{totalDistance}</p>
          </div>
        </div>
      </div>
      
      {/* Validation Errors */}
      {holeErrors.some(error => error) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">Please fix the errors in the scorecard. All holes must have valid par (2-6) and distance values.</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
            {holeErrors.map((error, index) => 
              error ? <li key={index}>{error}</li> : null
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
