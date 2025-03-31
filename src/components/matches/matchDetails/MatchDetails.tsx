import { Match } from '@/types';

interface MatchDetailsProps {
  match: Match;
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[--foreground]">
          Match Result
        </h3>
      </div>

      <div className="bg-[--input-bg] rounded-lg p-4 border border-[--border]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-[--muted] mb-2">{match.your_team}</p>
            <p className="font-medium text-2xl text-green-600 dark:text-green-400">{match.holes_won}</p>
          </div>
          <div>
            <p className="text-sm text-[--muted] mb-2">Tied</p>
            <p className="font-medium text-2xl text-yellow-600 dark:text-yellow-400">{match.holes_tied}</p>
          </div>
          <div>
            <p className="text-sm text-[--muted] mb-2">{match.opponent_team}</p>
            <p className="font-medium text-2xl text-red-600 dark:text-red-400">{match.holes_lost}</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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

      {/* Notes */}
      <div>
        <h4 className="text-base font-medium text-[--foreground] mb-3">Notes</h4>
        <div className="bg-[--input-bg] rounded-lg p-4 border border-[--border]">
          <p className="text-sm text-[--muted]">
            {match.notes || 'None'}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-base font-medium text-[--foreground] mb-3">Tags</h4>
        <div className="bg-[--input-bg] rounded-lg p-4 border border-[--border]">
          {match.tags && match.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {match.tags.map((tag: string, idx: number) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[--card-bg] text-[--foreground] border border-[--border]"
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