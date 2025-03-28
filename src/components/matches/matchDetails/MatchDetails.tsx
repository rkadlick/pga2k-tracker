import { Match } from '@/types';

interface MatchDetailsProps {
  match: Match;
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Match Details
        </h3>
      </div>
      <div className="border-t border-gray-200">
        {/* Match Result */}
        <div className="px-4 py-5 sm:px-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-blue-700">{match.your_team}</p>
                <p className="font-medium text-lg">{match.holes_won}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Tied</p>
                <p className="font-medium text-lg">{match.holes_tied}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">{match.opponent_team}</p>
                <p className="font-medium text-lg">{match.holes_lost}</p>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${match.winner_id === match.your_team_id ? 'bg-green-100 text-green-800' : 
                  match.winner_id === match.opponent_team_id ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'}`}
              >
                {match.winner_id === match.your_team_id 
                  ? `${match.your_team} won` 
                  : match.winner_id === match.opponent_team_id 
                    ? `${match.opponent_team} won`
                    : 'Match Tied'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-600">
            {match.notes || 'None'}
          </p>
        </div>

        {/* Tags */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
          {match.tags && match.tags.length > 0 ? (
            <div className="flex flex-wrap">
              {match.tags.map((tag: string, idx: number) => (
                <span key={idx} className="mr-1 mb-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">None</p>
          )}
        </div>
      </div>
    </div>
  );
} 