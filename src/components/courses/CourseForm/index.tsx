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
    holes,
    frontNine,
    backNine,
    frontNinePar,
    backNinePar,
    totalPar,
    frontNineDistance,
    backNineDistance,
    totalDistance,
    errors,
    updateHolePar,
    updateHoleDistance,
    handleSubmit,
    isSubmitting
  } = useCourseForm(onSubmit);

  const clearCourseNameError = () => {
    // This is now handled internally by the hook when setCourseName is called
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormHeader 
        courseName={courseName}
        setCourseName={setCourseName}
        error={errors.courseName}
        clearError={clearCourseNameError}
      />

      <div className="mt-8 space-y-6">
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
        
        <CourseTotals 
          totalPar={totalPar}
          totalDistance={totalDistance}
        />
      </div>
      
      {errors.holes.some(error => error) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">Please fix the errors in the scorecard. All holes must have valid par (2-6) and distance values.</p>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
