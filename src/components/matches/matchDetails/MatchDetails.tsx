import { Match } from '@/types';

interface MatchDetailsProps {
  match: Match;
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <div className="bg-[--card-bg] border border-[--border] overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-semibold text-[--foreground]">
          Match Details
        </h3>
      </div>
      <div className="border-t border-[--border]">
        {/* Match Result */}
        <div className="px-4 py-5 sm:px-6">
          <div className="bg-[--input-bg] rounded-lg p-4 border border-[--border]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-[--muted] mb-1">{match.your_team}</p>
                <p className="font-medium text-lg text-green-600 dark:text-green-400">{match.holes_won}</p>
              </div>
              <div>
                <p className="text-sm text-[--muted] mb-1">Tied</p>
                <p className="font-medium text-lg text-yellow-600 dark:text-yellow-400">{match.holes_tied}</p>
              </div>
              <div>
                <p className="text-sm text-[--muted] mb-1">{match.opponent_team}</p>
                <p className="font-medium text-lg text-red-600 dark:text-red-400">{match.holes_lost}</p>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  match.winner_id === null
                    ? 'bg-[--input-bg] text-[--muted]'
                    : match.winner_id === match.your_team_id
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200'
                }`}
              >
                {match.winner_id === null
                  ? 'Match Tied'
                  : match.winner_id === match.your_team_id
                  ? `${match.your_team} won${match.playoffs ? ' (Playoff)' : ''}`
                  : `${match.opponent_team} won${match.playoffs ? ' (Playoff)' : ''}`}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-[--border] px-4 py-5 sm:px-6">
          <h4 className="text-sm font-medium text-[--foreground] mb-2">Notes</h4>
          <p className="text-sm text-[--muted]">
            {match.notes || 'None'}
          </p>
        </div>

        {/* Tags */}
        <div className="border-t border-[--border] px-4 py-5 sm:px-6">
          <h4 className="text-sm font-medium text-[--foreground] mb-2">Tags</h4>
          {match.tags && match.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {match.tags.map((tag: string, idx: number) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[--input-bg] text-[--foreground] border border-[--border]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[--muted]">None</p>
          )}
        </div>
      </div>
    </div>
  );
} 