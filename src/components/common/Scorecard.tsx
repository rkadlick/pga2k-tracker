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
  total?: number;
  className?: string;
  onChange?: (rowId: string, index: number, value: string) => void;
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
    <div className={`overflow-x-auto card ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-[--border]">
          <h3 className="text-lg font-medium text-[--foreground]">{title}</h3>
        </div>
      )}
      <div className="min-w-full divide-y divide-[--border]">
        <div className="bg-[--background]/50">
          <div className="grid grid-cols-[100px_repeat(9,1fr)_100px]">
            {/* Label column */}
            <div className="px-3 py-2.5 text-xs font-medium text-[--muted] uppercase tracking-wider sticky left-0 bg-[--background]/50 text-left">
              {columns[0].label}
            </div>
            {/* Hole number columns (1-9) */}
            {columns.slice(1, 10).map(column => (
              <div
                key={column.id}
                className="px-3 py-2.5 text-xs font-medium text-[--muted] uppercase tracking-wider text-center"
              >
                {column.label}
              </div>
            ))}
            {/* Total column */}
            <div className="px-3 py-2.5 text-xs font-medium text-[--muted] uppercase tracking-wider text-center font-semibold">
              Total
            </div>
          </div>
        </div>
        <div className="divide-y divide-[--border] bg-transparent">
          {rows.map((row) => {
            let rowClass = 'transition-colors duration-200';
            let bgClass = '';
            
            switch (row.type) {
              case 'par':
                bgClass = 'bg-blue-500/5 hover:bg-blue-500/10';
                break;
              case 'distance':
                bgClass = 'bg-purple-500/5 hover:bg-purple-500/10';
                break;
              case 'match':
                bgClass = 'bg-[--background]/50 hover:bg-[--background]/75';
                break;
              default:
                bgClass = 'hover:bg-[--background]/50';
            }

            rowClass += ` ${bgClass}`;
            if (row.className) {
              rowClass += ` ${row.className}`;
            }

            return (
              <div key={row.id} className={rowClass}>
                <div className="grid grid-cols-[100px_repeat(9,1fr)_100px]">
                  {/* Label column */}
                  <div className={`px-3 py-2.5 font-medium text-[--foreground] sticky left-0 ${bgClass}`}>
                    {row.label}
                  </div>
                  {/* Value columns (1-9) */}
                  {row.values.map((value, index) => (
                    <div
                      key={`${row.id}-${index}-${value}`}
                      className={`px-3 py-2.5 text-center ${
                        row.type === 'match'
                          ? value === 'W'
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                            : value === 'L'
                            ? 'text-rose-600 dark:text-rose-400 font-medium'
                            : value === 'T'
                            ? 'text-amber-600 dark:text-amber-400 font-medium'
                            : 'text-[--muted]'
                          : row.type === 'par'
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : row.type === 'distance'
                          ? 'text-purple-600 dark:text-purple-400 font-medium'
                          : 'text-[--muted]'
                      }`}
                    >
                      {row.onChange ? (
                        <input
                          type="text"
                          value={value?.toString() || ''}
                          onChange={(e) => row.onChange!(row.id, index, e.target.value)}
                          className="w-full text-center bg-transparent border-b-2 border-current focus:outline-none focus:border-[--primary] transition-colors"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      ) : (
                        value?.toString() || ''
                      )}
                    </div>
                  ))}
                  {/* Total column */}
                  {row.total !== undefined && (
                    <div className={`px-3 py-2.5 text-center font-medium ${
                      row.type === 'par'
                        ? 'text-blue-600 dark:text-blue-400'
                        : row.type === 'distance'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-[--foreground]'
                    }`}>
                      {row.total}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
