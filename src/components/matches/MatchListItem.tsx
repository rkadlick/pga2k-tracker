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
        className="block hover:bg-gray-50"
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm font-medium text-blue-600 truncate">
                {match.your_team} vs {match.opponent_team}
              </div>
              {match.playoffs && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Playoff
                </span>
              )}
            </div>
            <div className="ml-2 flex-shrink-0 flex">
              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${match.winner_id === match.your_team_id ? 'bg-green-100 text-green-800' : 
                  match.winner_id === match.opponent_team_id ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'}`}
              >
                {match.winner_id === match.your_team_id 
                  ? `${match.your_team} won` 
                  : match.winner_id === match.opponent_team_id 
                    ? `${match.opponent_team} won`
                    : 'Tied'}
              </p>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex sm:space-x-4">
              <p className="flex items-center text-sm text-gray-500">
                {match.course.name}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                {formatNinePlayed(match.nine_played)}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <p>
                {match.rating_change}
              </p>
            </div>
          </div>
          {match.notes && (
            <div className="mt-2 text-sm text-gray-500 truncate">
              {match.notes}
            </div>
          )}
          {match.tags && match.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {match.tags.map((tag, idx) => (
                <span key={idx} className="mr-1 mb-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
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