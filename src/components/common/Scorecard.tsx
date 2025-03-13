// src/app/components/common/Scorecard.tsx
import React, { ReactNode } from 'react';

export type RowType = 'par' | 'distance' | 'score' | 'match' | 'custom';

interface ColumnConfig {
  label: string;
  className?: string;
}

interface ScoreRow {
  id: string;
  type: RowType;
  label: string;
  values: Array<number | string | null>;
  total?: number | string;
  editable?: boolean;
  className?: string;
  onChange?: (rowId: string, colIndex: number, value: string) => void;
  renderCell?: (value: number | string | null, colIndex: number, rowId: string) => ReactNode;
}

interface ScorecardProps {
  title?: string;
  columns: ColumnConfig[];
  rows: ScoreRow[];
  className?: string;
}

export default function Scorecard({
  title,
  columns,
  rows,
  className = '',
}: ScorecardProps) {
  // Define column widths
  const headerWidth = 'w-20';
  const dataWidth = 'w-10';
  const totalWidth = 'w-20';

  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className={headerWidth} />
            {columns.map((_, i) => (
              <col key={i} className={dataWidth} />
            ))}
            <col className={totalWidth} />
          </colgroup>
          
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="py-2 px-2 text-center border border-gray-300">Hole</th>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`py-2 px-1 text-center border border-gray-300 ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="py-2 px-2 text-center border border-gray-300 bg-green-800">Total</th>
            </tr>
          </thead>
          
          <tbody>
            {rows.map((row) => {
              // Determine row styling based on type
              let rowClass = '';
              switch (row.type) {
                case 'par':
                  rowClass = 'bg-green-50';
                  break;
                case 'distance':
                  rowClass = 'bg-blue-50';
                  break;
                case 'score':
                  rowClass = 'bg-gray-50';
                  break;
                case 'match':
                  rowClass = 'bg-yellow-50';
                  break;
                default:
                  rowClass = '';
              }

              if (row.className) {
                rowClass += ` ${row.className}`;
              }

              return (
                <tr key={row.id} className={rowClass}>
                  <td className="py-2 px-2 font-medium text-center border border-gray-300">
                    {row.label}
                  </td>
                  
                  {row.values.map((value, colIndex) => (
                    <td key={colIndex} className="p-0 border border-gray-300">
                      {row.editable ? (
                        <input
                          type="number"
                          value={value === null ? '' : value}
                          onChange={(e) => row.onChange && row.onChange(row.id, colIndex, e.target.value)}
                          className={`w-full h-full py-2 text-center ${rowClass}`}
                        />
                      ) : row.renderCell ? (
                        row.renderCell(value, colIndex, row.id)
                      ) : (
                        <div className="w-full h-full py-2 text-center">
                          {value === null ? '' : value}
                        </div>
                      )}
                    </td>
                  ))}
                  
                  <td className={`py-2 px-2 text-center font-medium border border-gray-300 ${
                    row.type === 'par' ? 'bg-green-100' : 
                    row.type === 'distance' ? 'bg-blue-100' : 
                    row.type === 'match' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {row.total === null ? '' : row.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
