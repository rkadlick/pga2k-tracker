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
    <div className={`${className}`} style={{ fontFamily: 'var(--font-tertiary)' }}>
      {title && (
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-lg font-medium text-[var(--foreground)]" style={{ fontFamily: 'var(--font-primary)' }}>{title}</h3>
        </div>
      )}
      
      {/* Desktop View */}
      <div className="hidden md:block min-w-full divide-y divide-[var(--border)]/90">
        <div className="bg-[var(--background)]/80">
          <div className="grid grid-cols-[100px_repeat(9,1fr)_100px]">
            <div className="px-3 py-2.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wider sticky left-0 bg-[var(--background)]/80 text-left">
              {columns[0].label}
            </div>
            {columns.slice(1, -1).map(column => (
              <div
                key={column.id}
                className="px-3 py-2.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wider text-center"
              >
                {column.label}
              </div>
            ))}
            <div className="px-3 py-2.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wider text-center">
              {columns[columns.length - 1].label}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--border)]/90 bg-transparent">
          {rows.map((row) => {
            let rowClass = 'transition-colors duration-200';
            let bgClass = '';
            
            switch (row.type) {
              case 'par':
                bgClass = 'bg-[var(--input-bg)]/80';
                break;
              case 'distance':
                bgClass = 'bg-[var(--input-bg)]/60';
                break;
              case 'match':
                bgClass = 'bg-[var(--background)]/80 hover:bg-[var(--background)]/90';
                break;
              default:
                bgClass = 'hover:bg-[var(--background)]/80';
            }

            rowClass += ` ${bgClass}`;
            if (row.className) {
              rowClass += ` ${row.className}`;
            }

            return (
              <div key={row.id} className={rowClass}>
                <div className="grid grid-cols-[100px_repeat(9,1fr)_100px]">
                  <div className={`px-3 py-2.5 font-medium text-[var(--foreground)] sticky left-0 ${bgClass}`}>
                    {row.label}
                  </div>
                  {row.values.map((value, index) => (
                    <div
                      key={`${row.id}-${index}`}
                      className={`px-3 py-2.5 text-center ${
                        row.type === 'match'
                          ? value === 'W'
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                            : value === 'L'
                            ? 'text-rose-600 dark:text-rose-400 font-medium'
                            : value === 'T'
                            ? 'text-amber-600 dark:text-amber-400 font-medium'
                            : 'text-[var(--muted)]'
                          : row.type === 'par'
                          ? 'text-purple-600 dark:text-purple-400 font-medium'
                          : row.type === 'distance'
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-[var(--muted)]'
                      }`}
                    >
                      {row.onChange ? (
                        <input
                          type="text"
                          value={value?.toString() || ''}
                          onChange={(e) => row.onChange!(row.id, index, e.target.value)}
                          className="w-full text-center bg-transparent border-b border-current focus:outline-none focus:border-[var(--primary)] transition-colors"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      ) : (
                        value?.toString() || '-'
                      )}
                    </div>
                  ))}
                  {row.total !== undefined && (
                    <div className={`px-3 py-2.5 text-center font-medium ${
                      row.type === 'par'
                        ? 'text-purple-600 dark:text-purple-400'
                        : row.type === 'distance'
                        ? 'text-blue-600 dark:text-blue-400'
                        : ''
                    }`}>
                      {row.type === 'match' ? '' : row.total}
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
          {columns.slice(1, -1).map((column, columnIndex) => (
            <div key={column.id} className={`space-y-2 p-2 relative ${
              columnIndex % 3 < 2 ? 'border-r border-[var(--border)]/90' : ''
            } ${
              columnIndex < 6 ? 'border-b border-[var(--border)]/90' : ''
            }`}>
              <div className="text-center bg-[var(--background)]/80 p-2 rounded-lg">
                {/* Hole Number */}
                <div className="text-sm font-medium text-[var(--muted)] pb-2 border-b border-[var(--border)]/90">
                  Hole {column.label}
                </div>

                {/* Par and Distance Row */}
                <div className="py-2 flex justify-center items-center gap-1.5">
                  <div className="text-purple-600 dark:text-purple-400 font-medium inline-flex items-center">
                    Par {rows[0].values[columnIndex]}
                  </div>
                  <div className="text-[var(--muted)]/90 text-[10px] leading-none translate-y-px">•</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center">
                    {rows[1].values[columnIndex]}y
                  </div>
                </div>

                {/* Result Row */}
                <div className="pt-2 border-t border-[var(--border)]/90">
                  <div className={`font-medium ${
                    rows[2].values[columnIndex] === 'W'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : rows[2].values[columnIndex] === 'L'
                      ? 'text-rose-600 dark:text-rose-400'
                      : rows[2].values[columnIndex] === 'T'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-[var(--muted)]'
                  }`}>
                    {rows[2].values[columnIndex]?.toString() || '-'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Totals Section */}
        <div className="border-b border-[var(--border)]/90 p-4">
          <div className="grid grid-cols-2 gap-4">
            {rows.slice(0, 2).map((row) => (
              <div
                key={`${row.id}-total`}
                className={`text-center p-2 rounded-lg ${row.className || ''}`}
              >
                <div className="text-xs text-[var(--muted)] mb-1">{row.label} Total</div>
                <div className={`font-medium ${
                  row.type === 'par'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-blue-600 dark:text-blue-400'
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
