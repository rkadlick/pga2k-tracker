import React from 'react';
import { HoleData } from '@/hooks/useCourseForm';

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
  const renderInput = (value: string | number | null | undefined, onChange: (value: string) => void) => (
    <input
      type="text"
      value={value?.toString() || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-center bg-[--input-bg] rounded-lg px-2 py-1 text-[--foreground] border border-[--input-border] focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus] transition-all duration-150"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );

  // Determine row IDs based on title
  const isBackNine = title.includes('Back');
  const parRowId = isBackNine ? 'backPar' : 'frontPar';
  const distanceRowId = isBackNine ? 'backDistance' : 'frontDistance';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full" style={{ fontFamily: 'var(--font-tertiary)' }}>
        <thead>
          <tr>
            <th className="px-3 py-1.5 text-center text-sm font-medium text-[--muted] uppercase tracking-wider w-28">
              <div className="inline-block border-b border-[--border] mx-auto pb-0.5">Hole</div>
            </th>
            {holes.map(hole => (
              <th key={hole.hole_number} className="px-1 py-1.5 text-center text-sm font-medium text-[--muted] uppercase tracking-wider w-24">
                <div className="inline-block border-b border-[--border] mx-auto pb-0.5">
                  {hole.hole_number}
                </div>
              </th>
            ))}
            <th className="px-3 py-1.5 text-center text-sm font-medium text-[--muted] uppercase tracking-wider w-28">
              <div className="inline-block border-b border-[--border] mx-auto pb-0.5">Total</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-[--input-bg]/50">
            <td className="px-3 py-2 whitespace-nowrap text-base font-medium text-[--foreground] text-center">Par</td>
            {holes.map((hole, index) => (
              <td key={`par-${hole.hole_number}`} className="px-1 py-2 whitespace-nowrap text-center">
                {renderInput(hole.par, (value) => updateHolePar(parRowId, index, value))}
              </td>
            ))}
            <td className="px-3 py-2 whitespace-nowrap text-center text-base text-[--foreground] font-medium">{totalPar}</td>
          </tr>
          <tr className="bg-[--input-bg]/30">
            <td className="px-3 py-2 whitespace-nowrap text-base font-medium text-[--foreground] text-center">Yards</td>
            {holes.map((hole, index) => (
              <td key={`distance-${hole.hole_number}`} className="px-1 py-2 whitespace-nowrap text-center">
                {renderInput(hole.distance, (value) => updateHoleDistance(distanceRowId, index, value))}
              </td>
            ))}
            <td className="px-3 py-2 whitespace-nowrap text-center text-base text-[--foreground] font-medium">{totalDistance}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
