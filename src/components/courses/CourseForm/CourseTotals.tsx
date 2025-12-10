import { CourseTotalsProps } from '@/types';
import React from 'react';

export default function CourseTotals({ totalPar, totalDistance }: CourseTotalsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-[--foreground] mb-6">Course Totals</h3>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-medium text-[--muted]">Total Par</p>
          <p className="mt-2 text-2xl font-semibold text-[--foreground]">{totalPar}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-[--muted]">Total Distance</p>
          <p className="mt-2 text-2xl font-semibold text-[--foreground]">{totalDistance} yards</p>
        </div>
      </div>
    </div>
  );
}
