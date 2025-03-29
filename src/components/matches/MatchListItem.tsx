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
    <li>
      <Link 
        href={`/matches/${match.id}`} 
        className="block hover:bg-[--input-hover] transition-colors"
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm font-medium text-[--primary] truncate">
                {match.your_team} vs {match.opponent_team}
              </div>
              {match.playoffs && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-200">
                  Playoff
                </span>
              )}
            </div>
            <div className="ml-2 flex-shrink-0 flex">
              <span className={`px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded-full ${
                match.winner_id === match.your_team_id 
                  ? 'bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-200' 
                  : match.winner_id === match.opponent_team_id 
                    ? 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200' 
                    : 'bg-[--input-bg] text-[--muted]'}`}
              >
                {match.winner_id === match.your_team_id 
                  ? `${match.your_team} won` 
                  : match.winner_id === match.opponent_team_id 
                    ? `${match.opponent_team} won`
                    : 'Tied'}
              </span>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex sm:space-x-4">
              <p className="flex items-center text-sm text-[--muted]">
                {match.course}
              </p>
              <p className="mt-2 flex items-center text-sm text-[--muted] sm:mt-0">
                {formatNinePlayed(match.nine_played)}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-[--muted] sm:mt-0">
              {match.rating_change !== undefined && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  match.rating_change > 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-200'
                    : match.rating_change < 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200'
                      : 'bg-[--input-bg] text-[--muted]'
                }`}>
                  {match.rating_change > 0 ? '+' : ''}{match.rating_change}
                </span>
              )}
            </div>
          </div>
          {match.notes && (
            <div className="mt-2 text-sm text-[--muted] truncate">
              {match.notes}
            </div>
          )}
          {match.tags && match.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {match.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[--input-bg] text-[--foreground] border border-[--border]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
} 