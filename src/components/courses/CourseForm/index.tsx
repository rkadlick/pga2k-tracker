import React from 'react';
import FormHeader from './FormHeader';
import HoleSection from './HoleSection';
import CourseTotals from './CourseTotals';
import { useCourseForm, HoleData } from '@/hooks/useCourseForm';

interface CourseFormProps {
  onSubmit: (courseName: string, holes: HoleData[], totalPar: number, totalDistance: number) => void;
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
    onSubmit(name, holes, totalPar, totalDist);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <FormHeader
        courseName={courseName}
        setCourseName={setCourseName}
        error={errors.courseName}
        clearError={() => {}} // This is now handled internally by setCourseName
      />

      <div className="space-y-6">
        <HoleSection
          title="Front Nine"
          holes={frontNine}
          totalPar={frontNinePar}
          totalDistance={frontNineDistance}
          updateHolePar={updateHolePar}
          updateHoleDistance={updateHoleDistance}
        />

        <HoleSection
          title="Back Nine"
          holes={backNine}
          totalPar={backNinePar}
          totalDistance={backNineDistance}
          updateHolePar={updateHolePar}
          updateHoleDistance={updateHoleDistance}
        />
      </div>

      <CourseTotals
        totalPar={frontNinePar + backNinePar}
        totalDistance={frontNineDistance + backNineDistance}
      />

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[--border] rounded-lg text-sm font-medium text-[--foreground] bg-[--input-bg] hover:bg-[--hover-bg] focus:outline-none focus:ring-2 focus:ring-[--primary]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
