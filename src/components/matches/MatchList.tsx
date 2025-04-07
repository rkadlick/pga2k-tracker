import React from 'react';
import Link from 'next/link';
import { Match } from '@/types';
import MatchListItem from './MatchListItem';

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  // Group matches by date_played
  const groupedMatches = matches.reduce((groups, match) => {
    const date = match.date_played.split('T')[0]; // Get just the date part
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
      <div className="text-center p-8 card animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 text-[--muted]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-[--muted] mb-4">No matches recorded yet.</p>
        <Link
          href="/matches/new"
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary] transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Record Your First Match</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedDates.map(date => (
        <section key={date} className="animate-fade-in space-y-6">
          {/* Date Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[--foreground]">
              <svg className="w-5 h-5 text-[--primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg font-semibold">
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

          {/* Matches for this date */}
          <ul className="space-y-4">
            {groupedMatches[date].map(match => (
              <MatchListItem key={match.id} match={match} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
} 