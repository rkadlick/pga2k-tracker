import React from 'react';
import Link from 'next/link';
import { Match, MatchListProps } from '@/types';
import MatchListItem from './MatchListItem';



export default function MatchList({ matches }: MatchListProps) {
  // Group matches by date_played
  const groupedMatches = matches.reduce((groups, match) => {
    const date = match.date_played.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Sort matches within each group by created_at in descending order
  Object.keys(groupedMatches).forEach(date => {
    groupedMatches[date].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-[--muted]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-[--muted] mb-4">No matches recorded yet.</p>
        <Link
          href="/matches/new"
          className="inline-flex items-center"
        >
          Add New Match
        </Link>
      </div>
    );
  }

  // Keep track of overall index across all dates
  let globalIndex = 0;

  return (
    <div className="space-y-12">
      {sortedDates.map(date => (
        <section key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[--primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg font-semibold text-[--foreground]">
                {new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC'
                })}
              </h2>
            </div>
            <div className="flex-grow border-t border-[--border]" />
          </div>

          {/* Matches List */}
          <div className="space-y-3">
            {groupedMatches[date].map(match => {
              const currentIndex = globalIndex++;
              return (
                <div key={match.id} className="animate-fade-in">
                  <MatchListItem match={match} index={currentIndex} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
} 