import React from 'react';
import Scorecard from '@/components/common/Scorecard';
import { HoleData } from './useCourseForms';

interface HoleSectionProps {
  title: string;
  holes: HoleData[];
  totalPar: number;
  totalDistance: number;
  updateHolePar: (rowId: string, colIndex: number, value: string) => void;
  updateHoleDistance: (rowId: string, colIndex: number, value: string) => void;
}

export default function HoleSection({
  title,
  holes,
  totalPar,
  totalDistance,
  updateHolePar,
  updateHoleDistance
}: HoleSectionProps) {
  // Create column configurations
  const columns = holes.map(hole => ({
    label: hole.hole_number.toString()
  }));

  // Determine row IDs based on title
  const isBackNine = title.includes('Back');
  const parRowId = isBackNine ? 'backPar' : 'frontPar';
  const distanceRowId = isBackNine ? 'backDistance' : 'frontDistance';

  return (
    <Scorecard 
      title={title}
      columns={columns}
      rows={[
        {
          id: parRowId,
          type: 'par',
          label: 'Par',
          values: holes.map(hole => hole.par),
          total: totalPar,
          editable: true,
          onChange: updateHolePar
        },
        {
          id: distanceRowId,
          type: 'distance',
          label: 'Yards',
          values: holes.map(hole => hole.distance),
          total: totalDistance,
          editable: true,
          onChange: updateHoleDistance
        }
      ]}
    />
  );
}
