import React from 'react';
import { format } from 'date-fns';
import { Match } from '@/types';
import MatchListItem from './MatchListItem';

interface MatchListByDateProps {
  date: string;
  matches: Match[];
}

export default function MatchListByDate({ date, matches }: MatchListByDateProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">
        {format(new Date(date), 'MMMM d, yyyy')}
      </h2>
      
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {matches.map(match => (
            <MatchListItem key={match.id} match={match} />
          ))}
        </ul>
      </div>
    </div>
  );
} 