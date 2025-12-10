'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Hole, HoleData } from '@/types';
import Scorecard from '@/components/common/Scorecard';
import { validateCourseName, validateHolePar, validateHoleDistance } from '@/lib/validation/courseValidation';
import { useCourses } from '@/hooks/useCourses';
import EditCourseHoles from '@/components/courses/CourseForm/EditCourseHoles';
import { use } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { IoArrowBack, IoClose } from "react-icons/io5";


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
  const [isSaving, setIsSaving] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [nameError, setNameError] = useState('');
  const [holeErrors, setHoleErrors] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const router = useRouter();
  const { updateCourse, removeCourse } = useCourses();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        const data = await response.json();
        setCourse(data.data);
        setCourseName(data.data.name);
        const convertedHoles = (data.data.holes || []).map((hole: Hole): HoleData => ({
          id: hole.id,
          hole_number: hole.hole_number,
          par: hole.par,
          distance: hole.distance ?? null,
          course_id: hole.course_id
        }));
        setHoles(convertedHoles);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleUpdateCourse = async () => {
    setNameError('');
    setHoleErrors([]);
    let hasErrors = false;

    const nameError = validateCourseName(courseName);
    if (nameError) {
      setNameError(nameError);
      hasErrors = true;
    }

    const newHoleErrors: string[] = [];
    holes.forEach((hole, index) => {
      const parError = validateHolePar(hole.par);
      const distanceError = validateHoleDistance(hole.distance);
      
      if (parError || distanceError) {
        newHoleErrors[index] = parError || distanceError || 'Invalid hole data';
        hasErrors = true;
      } else {
        newHoleErrors[index] = '';
      }
    });

    if (hasErrors) {
      setHoleErrors(newHoleErrors);
      return;
    }

    const frontNine = holes.filter(hole => hole.hole_number <= 9);
    const backNine = holes.filter(hole => hole.hole_number > 9);

    const frontPar = frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
    const backPar = backNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
    const totalPar = frontPar + backPar;

    const frontDistance = frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
    const backDistance = backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
    const totalDistance = frontDistance + backDistance;

    try {
      setIsSaving(true);
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
      setNameError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (course) {
      setCourseName(course.name);
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
    setHoleErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[holeNumber - 1] = '';
      return newErrors;
    });
  };

  const handleDeleteCourse = async () => {
    try {
      await removeCourse(id);
      router.push('/courses');
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-[--primary] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-[--muted]">Loading course details...</p>
        </div>
      </div>
    );
  }

  const frontNine = holes.filter(hole => hole.hole_number <= 9);
  const backNine = holes.filter(hole => hole.hole_number > 9);

  const frontNinePar = frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const backNinePar = backNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const totalPar = frontNinePar + backNinePar;

  const frontNineDistance = frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const backNineDistance = backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const totalDistance = frontNineDistance + backNineDistance;

  return (
    <div className="space-y-6">
      <style jsx global>{inputStyles}</style>
      
      {/* Breadcrumb outside card */}
      <div 
        onClick={() => isEditing ? handleCancel() : router.push('/courses')}
        className="breadcrumb"
      >
        {isEditing ? (
          <IoClose className="breadcrumb-icon" />
        ) : (
          <IoArrowBack className="breadcrumb-icon" />
        )}
        <span className="breadcrumb-text">
          {isEditing ? 'Cancel' : 'Back to Course List'}
        </span>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {!isEditing ? (
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>
                  {course.name}
                </h2>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center"
                  >
                    Edit Course
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="courseName" className="block text-sm font-medium text-[--muted] mb-2">
                    Course Name
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => {
                          setCourseName(e.target.value);
                          setNameError('');
                        }}
                        className={`block w-full px-4 py-2.5 rounded-xl bg-[--background]/50 border border-[--border] focus:border-[--primary] focus:ring-[--primary] text-[--foreground] ${
                          nameError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
                        }`}
                      />
                      {nameError && (
                        <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{nameError}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="sign-out"
                      >
                        Delete Course
                      </button>
                      <button
                        onClick={handleUpdateCourse}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Course Holes */}
      {isEditing ? (
        <div className="card">
          <div className="p-6">
            <EditCourseHoles
              holes={holes}
              onHoleUpdate={updateHole}
              holeErrors={holeErrors}
              isSubmitting={isSaving}
            />
          </div>
        </div>
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
          
          {/* Course Totals */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-primary)' }}>Course Totals</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-[--muted]" style={{ fontFamily: 'var(--font-tertiary)' }}>Total Par</p>
                  <p className="text-2xl font-bold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>{totalPar}</p>
                </div>
                <div>
                  <p className="text-sm text-[--muted]" style={{ fontFamily: 'var(--font-tertiary)' }}>Total Distance</p>
                  <p className="text-2xl font-bold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>{totalDistance} yards</p>
                </div>
                <div>
                  <p className="text-sm text-[--muted]" style={{ fontFamily: 'var(--font-tertiary)' }}>Total Holes</p>
                  <p className="text-2xl font-bold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>{holes.length}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[--card-bg] p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-primary)' }}>Delete Course</h3>
            <p className="text-[--muted] mb-6" style={{ fontFamily: 'var(--font-secondary)' }}>
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="sign-out"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
