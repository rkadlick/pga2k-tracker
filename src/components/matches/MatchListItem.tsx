import React from 'react';
import Link from 'next/link';
import { Match, NinePlayed } from '@/types';

interface MatchListItemProps {
  match: Match;
}

// Helper function to format nine_played value for display
function formatNinePlayed(ninePlayed: NinePlayed): string {
  switch (ninePlayed) {
    case 'front':
      return 'Front 9';
    case 'back':
      return 'Back 9';
    default:
      return ninePlayed;
  }
}

export default function MatchListItem({ match }: MatchListItemProps) {
  return (
    <li className="animate-fade-in">
      <Link 
        href={`/matches/${match.id}`} 
        className="block card hover:bg-[--primary]/5"
      >
        <div className="p-4 sm:p-6">
          {/* Header: Teams and Match Result */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-base font-medium text-[--foreground]">
                {match.your_team} <span className="text-[--muted]">vs</span> {match.opponent_team}
              </h3>
              {match.playoffs && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                               bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Playoff Match
                </span>
              )}
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                match.winner_id === match.your_team_id 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : match.winner_id === match.opponent_team_id 
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                    : 'bg-[--primary]/10 text-[--primary]'}`}
              >
                {match.winner_id === match.your_team_id 
                  ? `${match.your_team} won` 
                  : match.winner_id === match.opponent_team_id 
                    ? `${match.opponent_team} won`
                    : 'Tied'}
              </span>
            </div>
          </div>

          {/* Match Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4">
              {/* Course Info */}
              <div className="flex items-center text-sm text-[--muted]">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {match.course}
              </div>
              {/* Nine Played */}
              <div className="flex items-center text-sm text-[--muted]">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatNinePlayed(match.nine_played)}
              </div>
            </div>

            {/* Rating Change */}
            <div className="flex items-center justify-start sm:justify-end">
              {match.rating_change !== undefined && (
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                  match.rating_change > 0
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : match.rating_change < 0
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-[--primary]/10 text-[--primary]'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {match.rating_change > 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    ) : match.rating_change < 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    )}
                  </svg>
                  <span>{match.rating_change > 0 ? '+' : ''}{match.rating_change}</span>
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          {match.notes && (
            <div className="mt-4 text-sm text-[--muted] line-clamp-2">
              {match.notes}
            </div>
          )}

          {/* Tags */}
          {match.tags && match.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {match.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                           bg-[--primary]/5 text-[--primary] border border-[--primary]/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
} 