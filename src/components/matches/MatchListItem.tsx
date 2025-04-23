import React from 'react';
import Link from 'next/link';
import { Match, NinePlayed } from '@/types';
import { getName } from '@/utils/nameHelpers';
import { getLetterIcon, shouldUseFilled } from '@/utils/letterIcons';
import { GiGolfFlag } from "react-icons/gi";
import { TbMapPin2 } from "react-icons/tb";

interface MatchListItemProps {
  match: Match;
  index: number;
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

export default function MatchListItem({ match, index }: MatchListItemProps) {
  const yourTeamName = getName(match.your_team);
  const opponentTeamName = getName(match.opponent_team);
  const courseName = getName(match.course);
  
  // Get the appropriate letter icon component based on opponent's team name
  const LetterIcon = getLetterIcon(opponentTeamName, shouldUseFilled(index));
  
  return (
    <Link 
      href={`/matches/${match.id}`} 
      className="block card hover:bg-[var(--primary)]/5 transition-colors duration-150"
    >
      <div className="p-4 md:p-5">
        {/* Main Container */}
        <div className="flex items-center gap-4">
          {/* Opponent Team Letter Icon */}
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-[var(--primary)]">
            <LetterIcon className="w-9 h-9" />
          </div>

          {/* Match Info */}
          <div className="flex-1 min-w-0 flex items-center gap-6">
            {/* Teams and Course */}
            <div className="flex-1 min-w-0">
              <h3 className="card-title text-base md:text-lg truncate">
                {yourTeamName} <span className="text-[--muted]">vs</span> {opponentTeamName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 text-[--primary]">
                  <GiGolfFlag className="w-4 h-4" />
                  <span className="card-meta truncate">{courseName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[--primary]">
                  <TbMapPin2 className="w-4 h-4" />
                  <span className="card-meta">{formatNinePlayed(match.nine_played)}</span>
                </div>
              </div>
            </div>

            {/* Match Result and Rating */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
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
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
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

            {/* View Details Arrow */}
            <div className="flex-shrink-0 text-[--muted] group-hover:text-[--primary] transition-colors duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Notes and Tags Container */}
        {(match.notes || (match.tags && match.tags.length > 0)) && (
          <div className="mt-4 space-y-3 pl-16">
            {/* Notes */}
            {match.notes && (
              <div>
                <p className="card-meta line-clamp-2">{match.notes}</p>
              </div>
            )}

            {/* Tags */}
            {match.tags && match.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
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
        )}
      </div>
    </Link>
  );
} 