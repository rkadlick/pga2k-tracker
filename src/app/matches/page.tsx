'use client';

import { useRouter } from 'next/navigation';
import { Match, NinePlayed } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { useMatches } from '@/hooks/useMatches';
import { useAuth } from '@/hooks/useAuth';

// Helper function to format nine_played value for display
function formatNinePlayed(ninePlayed: NinePlayed): string {
  switch (ninePlayed) {
    case 'front':
      return 'Front 9';
    case 'back':
      return 'Back 9';
    case 'full':
      return 'Full 18';
    default:
      return ninePlayed;
  }
}

export default function MatchesPage() {
const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { matches, isLoading, error } = useMatches();

  // Group matches by date
  const groupedMatches = matches.reduce((groups, match) => {
    const date = match.date_played.split('T')[0]; // Get just the date part
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Match History</h1>
        
        {isAuthenticated && (
          <button
            onClick={() => router.push('/matches/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Match
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No matches found.</p>
          	{isAuthenticated && (
            <button
              onClick={() => router.push('/matches/new')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Your First Match
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">
                {format(new Date(date), 'MMMM d, yyyy')}
              </h2>
              
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {groupedMatches[date].map(match => (
                    <li key={match.id}>
                      <Link 
                        href={`/matches/${match.id}`} 
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-blue-600 truncate">
                                {match.your_team_name} vs {match.opponent_team_name}
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
                                  ? `${match.your_team_name} won` 
                                  : match.winner_id === match.opponent_team_id 
                                    ? `${match.opponent_team_name} won`
                                    : 'Tied'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex sm:space-x-4">
                              <p className="flex items-center text-sm text-gray-500">
                                {match.course_name}
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
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
