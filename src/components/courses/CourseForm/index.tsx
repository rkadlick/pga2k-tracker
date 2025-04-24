import React from 'react';
import FormHeader from './FormHeader';
import HoleSection from './HoleSection';
import CourseTotals from './CourseTotals';
import { useCourseForm, HoleData } from '@/hooks/useCourseForm';

interface CourseFormProps {
  onSubmit: (courseName: string, holes: HoleData[], frontPar: number, backPar: number, totalPar: number, frontDistance: number, backDistance: number, totalDistance: number) => void;
  onCancel: () => void;
}

export default function CourseForm({ onSubmit }: CourseFormProps) {
  const {
    courseName,
    setCourseName,
    frontNine,
    backNine,
    frontNinePar,
    backNinePar,
    frontNineDistance,
    backNineDistance,
    errors,
    updateHolePar,
    updateHoleDistance,
    handleSubmit: handleFormSubmit,
    isSubmitting
  } = useCourseForm((name, holes, frontPar, backPar, totalPar, frontDist, backDist, totalDist) => {
    onSubmit(name, holes, frontPar, backPar, totalPar, frontDist, backDist, totalDist);
  });

  return (
    <div className="animate-fade-in mt-2">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="card p-8">
          <FormHeader
            courseName={courseName}
            setCourseName={setCourseName}
            error={errors.courseName}
            clearError={() => {}}
          />
        </div>

        <div className="card p-8 space-y-8">
          <HoleSection
            title="Front Nine"
            holes={frontNine}
            totalPar={frontNinePar}
            totalDistance={frontNineDistance}
            updateHolePar={updateHolePar}
            updateHoleDistance={updateHoleDistance}
          />

          <div className="border-t border-[--border] pt-8">
            <HoleSection
              title="Back Nine"
              holes={backNine}
              totalPar={backNinePar}
              totalDistance={backNineDistance}
              updateHolePar={updateHolePar}
              updateHoleDistance={updateHoleDistance}
            />
          </div>
        </div>

        <div className="card p-8">
          <CourseTotals
            totalPar={frontNinePar + backNinePar}
            totalDistance={frontNineDistance + backNineDistance}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
