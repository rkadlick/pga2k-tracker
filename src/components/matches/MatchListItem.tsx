import React from 'react';
import Link from 'next/link';
import { Match, NinePlayed } from '@/types';
import { getName } from '@/utils/nameHelpers';
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
  const yourTeamName = getName(match.your_team);
  const opponentTeamName = getName(match.opponent_team);
  const courseName = getName(match.course);
  return (
    <li className="animate-fade-in">
      <Link 
        href={`/matches/${match.id}`} 
        className="block card hover:bg-[--primary]/5"
      >
        <div className="p-4 md:p-6">
          {/* Header: Teams, Playoff, and Course Info */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1.5 md:gap-2">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-[15px] md:text-base">
                <h3 className="font-medium text-[--foreground] truncate">
                  {yourTeamName} <span className="text-[--muted]">vs</span> {opponentTeamName}
                </h3>
                {match.playoffs && (
                  <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-md text-[11px] md:text-xs font-medium
                                 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    Playoff Match
                  </span>
                )}
              </div>
              
              {/* Course Info and Nine Played as subtitle */}
              <div className="flex items-center space-x-3 text-[11px] md:text-xs text-[--muted]">
                <div className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{courseName}</span>
                </div>
                <div className="flex items-center shrink-0">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatNinePlayed(match.nine_played)}
                </div>
              </div>
            </div>

            {/* Winner and Rating - Hidden on mobile/tablet overflow, shown on desktop */}
            <div className="hidden md:flex items-center gap-2 text-[13px] md:text-xs shrink-0">
              <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-md font-medium ${
                match.winner_id === match.your_team_id 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : match.winner_id === match.opponent_team_id 
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                    : 'bg-[--primary]/10 text-[--primary]'}`}
              >
                {match.winner_id === match.your_team_id 
                  ? `${yourTeamName} won` 
                  : match.winner_id === match.opponent_team_id 
                    ? `${opponentTeamName} won`
                    : 'Tied'}
              </span>
              {match.rating_change !== undefined && (
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 md:py-1 rounded-md font-medium ${
                  match.rating_change > 0
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : match.rating_change < 0
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-[--primary]/10 text-[--primary]'
                }`}>
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Winner and Rating - Mobile/Tablet overflow only */}
          <div className="flex md:hidden items-center gap-2 text-[13px] mt-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium ${
              match.winner_id === match.your_team_id 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                : match.winner_id === match.opponent_team_id 
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                  : 'bg-[--primary]/10 text-[--primary]'}`}
            >
              {match.winner_id === match.your_team_id 
                ? `${yourTeamName} won` 
                : match.winner_id === match.opponent_team_id 
                  ? `${opponentTeamName} won`
                  : 'Tied'}
            </span>
            {match.rating_change !== undefined && (
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-medium ${
                match.rating_change > 0
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : match.rating_change < 0
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'bg-[--primary]/10 text-[--primary]'
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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