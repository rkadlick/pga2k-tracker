import React, { useState, useEffect } from 'react';
import FormHeader from './FormHeader';
import HoleSection from './HoleSection';
import CourseTotals from './CourseTotals';
import { useCourseForm, HoleData } from '@/hooks/useCourseForm';

interface CourseFormProps {
  onSubmit: (courseName: string, holes: HoleData[], frontPar: number, backPar: number, totalPar: number, frontDistance: number, backDistance: number, totalDistance: number) => void;
  onCancel: () => void;
}

export default function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200; // Adjust this value to change when the buttons move
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const ActionButtons = () => (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        onClick={onCancel}
        className="secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Course'}
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in mt-[-48px]">
      <div className={`flex justify-end mb-8 transition-opacity duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
        <ActionButtons />
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
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

        {/* Bottom buttons that show when scrolled */}
        <div className={`transition-opacity duration-300 ${isScrolled ? 'block' : 'hidden'}`}>
          <ActionButtons />
        </div>
      </form>
    </div>
  );
}
