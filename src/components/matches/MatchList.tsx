import React from 'react';
import { Match } from '@/types';
import MatchListByDate from './MatchListByDate';

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  // Group matches by date
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

  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <MatchListByDate
          key={date}
          date={date}
          matches={groupedMatches[date]}
        />
      ))}
    </div>
  );
} 