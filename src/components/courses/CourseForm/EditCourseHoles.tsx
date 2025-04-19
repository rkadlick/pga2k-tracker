import HoleSection from './HoleSection';

interface HoleData {
  id: string;
  hole_number: number;
  par: number | null;
  distance: number | null;
  course_id: string;
}

interface EditCourseHolesProps {
  holes: HoleData[];
  onHoleUpdate: (holeNumber: number, field: 'par' | 'distance', value: number | null) => void;
  holeErrors: string[];
  isSubmitting?: boolean;
}

export default function EditCourseHoles({ holes, onHoleUpdate, holeErrors, isSubmitting = false }: EditCourseHolesProps) {
  // Prepare data for the scorecard
  const frontNine = holes.filter(hole => hole.hole_number <= 9).sort((a, b) => a.hole_number - b.hole_number);
  const backNine = holes.filter(hole => hole.hole_number > 9).sort((a, b) => a.hole_number - b.hole_number);

  // Calculate totals
  const frontPar = frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const backPar = backNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const totalPar = frontPar + backPar;

  const frontDistance = frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const backDistance = backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const totalDistance = frontDistance + backDistance;

  // Define update functions
  const updateHolePar = (rowId: string, colIndex: number, value: string) => {
    const holeNumber = rowId.startsWith('front') ? colIndex + 1 : colIndex + 10;
    const numValue = value === '' ? null : parseInt(value, 10);
    onHoleUpdate(holeNumber, 'par', numValue);
  };

  const updateHoleDistance = (rowId: string, colIndex: number, value: string) => {
    const holeNumber = rowId.startsWith('front') ? colIndex + 1 : colIndex + 10;
    const numValue = value === '' ? null : parseInt(value, 10);
    onHoleUpdate(holeNumber, 'distance', numValue);
  };

  return (
    <div className="space-y-8 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-[--background]/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-[--primary]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[--foreground] font-medium">Saving changes...</span>
          </div>
        </div>
      )}

      {/* Front Nine */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Front Nine</h2>
        <HoleSection
          title="Front Nine"
          holes={frontNine}
          totalPar={frontPar}
          totalDistance={frontDistance}
          updateHolePar={updateHolePar}
          updateHoleDistance={updateHoleDistance}
        />
      </div>

      {/* Back Nine */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Back Nine</h2>
        <HoleSection
          title="Back Nine"
          holes={backNine}
          totalPar={backPar}
          totalDistance={backDistance}
          updateHolePar={updateHolePar}
          updateHoleDistance={updateHoleDistance}
        />
      </div>

      {/* Total */}
      <div className="flex justify-end space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Par</p>
          <p className="text-lg font-semibold">{totalPar}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Distance</p>
          <p className="text-lg font-semibold">{totalDistance}</p>
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