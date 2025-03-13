import React from 'react';

interface CourseTotalsProps {
  totalPar: number;
  totalDistance: number;
}

export default function CourseTotals({ totalPar, totalDistance }: CourseTotalsProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-2">Course Totals</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Par</p>
          <p className="font-medium">{totalPar}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Yards</p>
          <p className="font-medium">{totalDistance}</p>
        </div>
      </div>
    </div>
  );
}
