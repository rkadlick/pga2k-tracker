import { format } from 'date-fns';
import { Match, NinePlayed } from '@/types';

interface MatchOverviewProps {
  match: Match;
}

function formatNinePlayed(ninePlayed: NinePlayed): string {
  switch (ninePlayed) {
    case 'front':
      return 'Front 9';
    case 'back':
      return 'Back 9';
    case 'all':
      return 'Full 18';
    default:
      return ninePlayed;
  }
}

export default function MatchOverview({ match }: MatchOverviewProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {match.your_team} vs {match.opponent_team}
          {match.playoffs && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Playoff
            </span>
          )}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {format(new Date(match.date_played), 'MMMM d, yyyy')} • {match.course} • {formatNinePlayed(match.nine_played)}
        </p>
      </div>

      {/* Teams Section */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your Team */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">{match.your_team}</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                Player 1: {match.player1_name} (Rating: {match.player1_rating})
              </li>
              <li className="text-sm text-gray-600">
                Player 2: {match.player2_name} (Rating: {match.player2_rating})
              </li>
            </ul>
          </div>

          {/* Opponent Team */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">{match.opponent_team}</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                Player 1: {match.opponent1_name} (Rating: {match.opponent1_rating})
              </li>
              <li className="text-sm text-gray-600">
                Player 2: {match.opponent2_name} (Rating: {match.opponent2_rating})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 