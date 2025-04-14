import { Match } from '@/types';
import { getName } from '@/utils/nameHelpers';
import { format } from 'date-fns';

interface MatchOverviewProps {
  match: Match;
}

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[--foreground] flex items-center">
          {yourTeamName} vs {opponentTeamName}
          {match.playoffs && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-200">
              Playoff
            </span>
          )}
        </h3>
        <p className="mt-2 text-sm text-[--muted]">
          {format(new Date(match.date_played), 'MMMM d, yyyy')} • {courseName} • {formatNinePlayed(match.nine_played)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Team */}
        <div className="rounded-lg p-4 bg-[--input-bg] border border-[--border]">
          <h4 className="text-base font-medium text-[--foreground] mb-4">{yourTeamName}</h4>
          <ul className="space-y-3">
            <li className="text-sm flex items-center justify-between">
              <span className="text-[--foreground]">{player1Name}</span>
              <span className="flex items-center text-[--muted]">
                <span className="mr-1">Rating: {match.player1_rating}</span>
                {match.rating_change && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    match.rating_change > 0 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-200' 
                      : 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200'
                  }`}>
                    {match.rating_change > 0 ? '+' : ''}{match.rating_change}
                  </span>
                )}
                <span className="ml-1">= {match.player1_rating + (match?.rating_change || 0)}</span>
              </span>
            </li>
            <li className="text-sm flex items-center justify-between">
              <span className="text-[--foreground]">{player2Name}</span>
              <span className="flex items-center text-[--muted]">
                <span className="mr-1">Rating: {match.player2_rating}</span>
                {match.rating_change && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    match.rating_change > 0 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-200' 
                      : 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200'
                  }`}>
                    {match.rating_change > 0 ? '+' : ''}{match.rating_change}
                  </span>
                )}
                <span className="ml-1">= {match.player2_rating + (match?.rating_change || 0)}</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Opponent Team */}
        <div className="rounded-lg p-4 bg-[--input-bg] border border-[--border]">
          <h4 className="text-base font-medium text-[--foreground] mb-4">{opponentTeamName}</h4>
          <ul className="space-y-3">
            <li className="text-sm flex items-center justify-between">
              <span className="text-[--foreground]">{opponent1Name}</span>
              <span className="text-[--muted]">Rating: {match.opponent1_rating}</span>
            </li>
            <li className="text-sm flex items-center justify-between">
              <span className="text-[--foreground]">{opponent2Name}</span>
              <span className="text-[--muted]">Rating: {match.opponent2_rating}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
