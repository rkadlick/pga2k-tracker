import Scorecard from '@/components/common/Scorecard';

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
}

export default function EditCourseHoles({ holes, onHoleUpdate, holeErrors }: EditCourseHolesProps) {
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
    <div className="space-y-8">
      {/* Front Nine */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Front Nine</h2>
        <Scorecard
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
              total: frontPar,
              onChange: updateHolePar
            },
            {
              id: 'frontDistance',
              type: 'distance',
              label: 'Yards',
              values: frontNine.map(hole => hole.distance?.toString() || ''),
              total: frontDistance,
              onChange: updateHoleDistance
            }
          ]}
        />
      </div>

      {/* Back Nine */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Back Nine</h2>
        <Scorecard
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
              total: backPar,
              onChange: updateHolePar
            },
            {
              id: 'backDistance',
              type: 'distance',
              label: 'Yards',
              values: backNine.map(hole => hole.distance?.toString() || ''),
              total: backDistance,
              onChange: updateHoleDistance
            }
          ]}
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