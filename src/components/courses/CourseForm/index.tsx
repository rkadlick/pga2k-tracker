import React from 'react';
import FormHeader from './FormHeader';
import HoleSection from './HoleSection';
import CourseTotals from './CourseTotals';
import { useCourseForm, HoleData } from '@/hooks/useCourseForm';

interface CourseFormProps {
  onSubmit: (courseName: string, holes: HoleData[], frontPar: number, backPar: number, totalPar: number, frontDistance: number, backDistance: number, totalDistance: number) => void;
  onCancel: () => void;
}

export default function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
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
    <form onSubmit={handleFormSubmit} className="space-y-8">
      <div className="card">
        <FormHeader
          courseName={courseName}
          setCourseName={setCourseName}
          error={errors.courseName}
          clearError={() => {}}
        />
      </div>

      <div className="card">
        <HoleSection
          title="Front Nine"
          holes={frontNine}
          totalPar={frontNinePar}
          totalDistance={frontNineDistance}
          updateHolePar={updateHolePar}
          updateHoleDistance={updateHoleDistance}
        />
      </div>

      <div className="card">
        <HoleSection
          title="Back Nine"
          holes={backNine}
          totalPar={backNinePar}
          totalDistance={backNineDistance}
          updateHolePar={updateHolePar}
          updateHoleDistance={updateHoleDistance}
        />
      </div>

      <div className="card">
        <CourseTotals
          totalPar={frontNinePar + backNinePar}
          totalDistance={frontNineDistance + backNineDistance}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-[--foreground] bg-[--input-bg] hover:bg-[--hover-bg] focus:outline-none focus:ring-2 focus:ring-[--primary] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
