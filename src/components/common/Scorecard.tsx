// src/app/components/common/Scorecard.tsx
import React from 'react';

export type RowType = 'par' | 'distance' | 'score' | 'match' | 'custom';

interface Column {
  id: string;
  label: string;
  className?: string;
}

interface Row {
  id: string;
  type: RowType;
  label: string;
  values: (string | number | null)[];
  total?: string | number;
  className?: string;
  onChange?: (rowId: string, colIndex: number, value: string) => void;
}

interface ScorecardProps {
  title?: string;
  columns: Column[];
  rows: Row[];
  className?: string;
}

export default function Scorecard({
  title,
  columns,
  rows,
  className = ''
}: ScorecardProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      {title && <h3 className="text-lg font-medium text-[--foreground] mb-4">{title}</h3>}
      <table className="min-w-full divide-y divide-[--border]">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-3 py-2 text-center text-xs font-medium text-[--muted] uppercase tracking-wider bg-[--card-bg] ${
                  column.className || ''
                } ${column.id === 'label' ? 'sticky left-0 bg-[--card-bg] text-left' : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[--border]">
          {rows.map((row) => {
            let rowClass = 'whitespace-nowrap text-sm hover:bg-[--input-hover] transition-colors duration-200';
            let bgClass = '';
            
            switch (row.type) {
              case 'par':
                bgClass = 'bg-blue-50/50 dark:bg-blue-900/20';
                break;
              case 'distance':
                bgClass = 'bg-purple-50/50 dark:bg-purple-900/20';
                break;
              case 'match':
                bgClass = 'bg-[--background]';
                break;
              default:
                bgClass = 'bg-[--input-bg]/30';
            }

            rowClass += ` ${bgClass}`;
            if (row.className) {
              rowClass += ` ${row.className}`;
            }

            return (
              <tr key={row.id} className={rowClass}>
                <td className={`px-3 py-2 font-medium text-[--foreground] sticky left-0 ${bgClass}`}>
                  {row.label}
                </td>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.id}-${index}-${value}`}
                    className={`px-3 py-2 text-center ${
                      row.type === 'match'
                        ? value === 'W'
                          ? 'text-green-600 dark:text-green-400 font-medium'
                          : value === 'L'
                          ? 'text-red-600 dark:text-red-400 font-medium'
                          : value === 'T'
                          ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                          : 'text-[--muted]'
                        : row.type === 'par'
                        ? 'text-blue-700 dark:text-blue-400 font-medium'
                        : row.type === 'distance'
                        ? 'text-purple-700 dark:text-purple-400 font-medium'
                        : 'text-[--muted]'
                    }`}
                  >
                    {row.onChange ? (
                      <input
                        type="text"
                        value={value?.toString() || ''}
                        onChange={(e) => row.onChange!(row.id, index, e.target.value)}
                        className="w-16 text-center bg-transparent border-b border-current focus:outline-none focus:border-blue-500"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    ) : (
                      value?.toString() || ''
                    )}
                  </td>
                ))}
                {row.total !== undefined && (
                  <td className={`px-3 py-2 text-center font-medium ${
                    row.type === 'par'
                      ? 'text-blue-700 dark:text-blue-400'
                      : row.type === 'distance'
                      ? 'text-purple-700 dark:text-purple-400'
                      : 'text-[--foreground]'
                  }`}>
                    {row.total}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
