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
  className = ''
}: ScorecardProps) {
  return (
    <div className={`space-y-3 w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      )}
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {columns[0].label}
              </th>
              {columns.slice(1).map((col, i) => (
                <th 
                  key={i} 
                  className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row) => {
              // Determine row styling based on type
              let rowClass = 'whitespace-nowrap text-sm';
              switch (row.type) {
                case 'par':
                  rowClass += ' font-medium text-gray-900';
                  break;
                case 'distance':
                  rowClass += ' font-medium text-gray-900';
                  break;
                case 'score':
                  rowClass += ' text-gray-500';
                  break;
                case 'match':
                  rowClass += ' font-medium text-gray-900';
                  break;
                default:
                  rowClass += ' text-gray-500';
              }

              if (row.className) {
                rowClass += ` ${row.className}`;
              }

              return (
                <tr key={row.id}>
                  <td className={`px-4 py-2 ${rowClass}`}>
                    {row.label}
                  </td>
                  
                  {row.values.map((value, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-2 py-2 text-center ${rowClass}`}
                    >
                      {row.editable ? (
                        <input
                          type="number"
                          value={value === null ? '' : value}
                          onChange={(e) => row.onChange && row.onChange(row.id, colIndex, e.target.value)}
                          className={`w-full h-full py-2 text-center focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          min={row.type === 'par' ? 2 : 1}
                          max={row.type === 'par' ? 6 : 999}
                          step="1"
                          data-row-id={row.id}
                          data-col-index={colIndex}
                        />
                      ) : row.renderCell ? (
                        <div className="w-full h-full">
                          {row.renderCell(value, colIndex, row.id)}
                        </div>
                      ) : (
                        <div className="w-full h-full">
                          {value === null ? '' : value}
                        </div>
                      )}
                    </td>
                  ))}
                  
                  <td className={`px-2 py-2 text-center font-medium ${rowClass}`}>
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
