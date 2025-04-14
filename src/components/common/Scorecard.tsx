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
  values: (string | number | null | undefined)[];
  total?: number | string;
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
    <div className={`card ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-[--border]">
          <h3 className="text-lg font-medium text-[--foreground]">{title}</h3>
        </div>
      )}
      
      {/* Desktop View */}
      <div className="hidden md:block min-w-full divide-y divide-[--border]">
        <div className="bg-[--background]/50">
          <div className="grid grid-cols-[100px_repeat(9,1fr)_100px]">
            <div className="px-3 py-2.5 text-xs font-medium text-[--muted] uppercase tracking-wider sticky left-0 bg-[--background]/50 text-left">
              {columns[0].label}
            </div>
            {columns.slice(1, 10).map(column => (
              <div
                key={column.id}
                className="px-3 py-2.5 text-xs font-medium text-[--muted] uppercase tracking-wider text-center"
              >
                {column.label}
              </div>
            ))}
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
                  <div className={`px-3 py-2.5 font-medium text-[--foreground] sticky left-0 ${bgClass}`}>
                    {row.label}
                  </div>
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

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 p-4">
          {columns.slice(1, 10).map((column, columnIndex) => (
            <div key={column.id} className={`space-y-2 p-2 relative ${
              // Add right border for first two columns
              columnIndex % 3 < 2 ? 'border-r border-white/40' : ''
            } ${
              // Add bottom border for first two rows
              columnIndex < 6 ? 'border-b border-white/40' : ''
            }`}>
              <div className="text-center bg-[--background]/50 p-2 rounded-lg">
                <div className="text-sm font-medium text-[--muted] pb-2 border-b border-white/25">Hole {column.label}</div>
                {rows.map((row, rowIndex) => (
                  <div
                    key={`${row.id}-${columnIndex}`}
                    className={`mt-1 font-medium ${
                      row.type === 'match'
                        ? row.values[columnIndex] === 'W'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : row.values[columnIndex] === 'L'
                          ? 'text-rose-600 dark:text-rose-400'
                          : row.values[columnIndex] === 'T'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[--muted]'
                        : row.type === 'par'
                        ? 'text-blue-600 dark:text-blue-400'
                        : row.type === 'distance'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-[--muted]'
                    } ${
                      // Add bottom border for all but last row
                      rowIndex < rows.length - 1 ? 'pb-1 border-b border-white/15' : ''
                    }`}
                  >
                    <div className="text-xs text-[--muted]">{row.label}</div>
                    {row.onChange ? (
                      <input
                        type="text"
                        value={row.values[columnIndex]?.toString() || ''}
                        onChange={(e) => row.onChange!(row.id, columnIndex, e.target.value)}
                        className="w-full text-center bg-transparent border-b border-current focus:outline-none focus:border-[--primary]"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    ) : (
                      row.values[columnIndex]?.toString() || '-'
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Totals Section */}
        <div className="border-t border-[--border] p-4">
          <div className="grid grid-cols-3 gap-4">
            {rows.map((row) => (
              <div
                key={`${row.id}-total`}
                className={`text-center p-2 rounded-lg ${
                  row.type === 'par'
                    ? 'bg-blue-500/5'
                    : row.type === 'distance'
                    ? 'bg-purple-500/5'
                    : 'bg-[--background]/50'
                }`}
              >
                <div className="text-xs text-[--muted] mb-1">{row.label} Total</div>
                <div className={`font-medium ${
                  row.type === 'par'
                    ? 'text-blue-600 dark:text-blue-400'
                    : row.type === 'distance'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-[--foreground]'
                }`}>
                  {row.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
