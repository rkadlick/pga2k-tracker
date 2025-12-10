
  import { MatchOverviewProps } from '@/types';
import { getName } from '@/utils/nameHelpers';
import { format } from 'date-fns';
import { GiGolfFlag } from "react-icons/gi";
import { TbMapPin2, TbCalendar } from "react-icons/tb";
import { getLetterIcon, shouldUseFilled } from '@/utils/letterIcons';

const formatNinePlayed = (nine: string) => {
  return nine === 'FRONT' ? 'Front 9' : 'Back 9';
};

export default function MatchOverview({ match }: MatchOverviewProps) {
  // Process all names at the start
  const yourTeamName = getName(match.your_team);
  const opponentTeamName = getName(match.opponent_team);
  const courseName = getName(match.course);
  const player1Name = getName(match.player1_name);
  const player2Name = getName(match.player2_name);
  const opponent1Name = getName(match.opponent1_name);
  const opponent2Name = getName(match.opponent2_name);

  // Get the opponent team's letter icon
  const OpponentLetterIcon = getLetterIcon(opponentTeamName, shouldUseFilled(0));

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Opponent Team Letter Icon */}
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-[var(--primary)]">
          <OpponentLetterIcon className="w-9 h-9" />
        </div>

        {/* Match Info */}
        <div className="flex-1 space-y-2 md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                {yourTeamName} <span className="text-[var(--muted)]">vs</span> {opponentTeamName}
              </h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                ${match.season === 1 ? 'text-[var(--season-1)] bg-[var(--season-1-bg)]' :
                  match.season === 2 ? 'text-[var(--season-2)] bg-[var(--season-2-bg)]' :
                  match.season === 3 ? 'text-[var(--season-3)] bg-[var(--season-3-bg)]' :
                  match.season === 4 ? 'text-[var(--season-4)] bg-[var(--season-4-bg)]' :
                  'text-[var(--season-5)] bg-[var(--season-5-bg)]'}`}>
                Season {match.season}
              </span>
            </div>
            {match.playoffs && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-200">
                Playoff
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <GiGolfFlag className="w-4 h-4 text-[var(--primary)]" />
              <span className="card-meta">{courseName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TbMapPin2 className="w-4 h-4 text-[var(--primary)]" />
              <span className="card-meta">{formatNinePlayed(match.nine_played)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TbCalendar className="w-4 h-4 text-[var(--primary)]" />
              <span className="card-meta">
                {format(new Date(match.date_played), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {match.tags && match.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {match.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-[1px] w-full bg-[var(--border)]" />

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Team */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              {yourTeamName}
            </h3>
          </div>
          <div className="pl-4 border-l-2 border-emerald-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[--foreground]">{player1Name}</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-[--muted]">
                    {match.player1_rating}
                  </span>
                  {match.rating_change && (
                    <div className="flex items-center gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        match.rating_change > 0 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {match.rating_change > 0 ? '+' : ''}{match.rating_change}
                      </span>
                      <span className="text-[--muted]">=</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"> {match.player1_rating + (match?.rating_change || 0)}</span>
                    </div>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[--foreground]">{player2Name}</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-[--muted]">
                    {match.player2_rating}
                  </span>
                  {match.rating_change && (
                    <div className="flex items-center gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        match.rating_change > 0 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {match.rating_change > 0 ? '+' : ''}{match.rating_change}
                      </span>
                      <span className="text-[--muted]">=</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"> {match.player2_rating + (match?.rating_change || 0)}</span>
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Opponent Team */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h3 className="text-lg font-medium text-[--foreground]">
              {opponentTeamName}
            </h3>
          </div>
          <div className="pl-4 border-l-2 border-blue-500/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[--foreground]">{opponent1Name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {match.opponent1_rating}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[--foreground]">{opponent2Name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {match.opponent2_rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
