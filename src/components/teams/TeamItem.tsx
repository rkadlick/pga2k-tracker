'use client';

import Link from 'next/link';
import { Team } from '@/types';
import { getLetterIcon, shouldUseFilled } from '@/utils/letterIcons';

interface TeamItemProps {
  team: Team;
  isAuthenticated: boolean;
  index: number;
}

export default function TeamItem({ team, isAuthenticated, index }: TeamItemProps) {
  const LetterIcon = getLetterIcon(team.name, shouldUseFilled(index));

  return (
    <div className="card hover:bg-[var(--primary)]/5 h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* Team Icon and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-[var(--primary)]">
            <LetterIcon className="w-11 h-11" />
          </div>
          <Link
            href={`/teams/${team.id}`}
            className="card-title"
          >
            {team.name}
          </Link>
          {team.is_your_team && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400">
              Your Team
            </span>
          )}
        </div>

        {/* Players List */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-2">
            {team.players?.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 rounded-lg
                         bg-[--background]/50 hover:bg-[--background]/75
                         transition-colors"
              >
                <span className="text-sm font-medium text-[--foreground]">
                  {player.name}
                </span>
                <span className="text-sm font-medium text-[--muted]">
                  Rating: {player.recent_rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <Link
            href={`/teams/${team.id}`}
            className="card-action group py-2.5 flex items-center justify-center gap-2"
          >
            <svg 
              className="w-[18px] h-[18px] text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors duration-150" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
            {isAuthenticated ? 'View & Edit' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
} 