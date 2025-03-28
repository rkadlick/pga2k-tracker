'use client';

import { useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import MatchForm from '@/components/matches/MatchForm';
import { MatchFormData } from '@/hooks/useMatchForm';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTeams } from '@/hooks/useTeams';
import { HoleResult } from '@/types';

export default function NewMatchPage() {
  const router = useRouter();
  const { createMatch, error: matchError } = useMatches();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeams();

  const yourTeam = teams.find(team => team.is_your_team);
  
  const handleSubmit = async (data: MatchFormData) => {
    try {
      if (!yourTeam) {
        throw new Error('Your team not found');
      }

      if (!data.course_id) {
        throw new Error('Course not selected');
      }

      if (!data.opponent_team_id) {
        throw new Error('Opponent team not selected');
      }

      // Transform the data to match what createMatch expects
      // Filter out any hole results with null values
      const validHoleResults = data.hole_results
        .filter(hr => hr.result !== null)
        .map(hr => ({
          hole_number: hr.hole_number,
          result: hr.result as HoleResult, // Safe to cast since we filtered nulls
          match_id: undefined // This will be set by the backend
        }));

      // Calculate holes won, lost, tied
      const { holesWon, holesLost, holesTied } = validHoleResults.reduce((counts, hr) => {
        if (hr.result === 'win') return { ...counts, holesWon: counts.holesWon + 1 };
        if (hr.result === 'loss') return { ...counts, holesLost: counts.holesLost + 1 };
        if (hr.result === 'tie') return { ...counts, holesTied: counts.holesTied + 1 };
        return counts;
      }, { holesWon: 0, holesLost: 0, holesTied: 0 });

      // Calculate scores based on holes
      const yourTeamScore = holesWon + (holesTied * 0.5);
      const opponentTeamScore = holesLost + (holesTied * 0.5);

      // Determine winner
      let winnerId = null;
      if (yourTeamScore > opponentTeamScore) {
        winnerId = yourTeam.id;
      } else if (opponentTeamScore > yourTeamScore) {
        winnerId = data.opponent_team_id;
      }
      
      let rating_change = 0;
      if (winnerId !== yourTeam.id) {
        rating_change = 0 - data.rating_change;
      } else {
        rating_change = data.rating_change;
      }

      const matchData = {
        date_played: data.date_played,
        course_id: data.course_id,
        nine_played: data.nine_played,
        your_team_id: yourTeam.id,
        opponent_team_id: data.opponent_team_id,
        player1_id: data.player1_id,
        player1_rating: data.player1_rating,
        player2_id: data.player2_id,
        player2_rating: data.player2_rating,
        opponent1_id: data.opponent1_id,
        opponent1_rating: data.opponent1_rating,
        opponent2_id: data.opponent2_id,
        opponent2_rating: data.opponent2_rating,
        hole_results: validHoleResults,
        rating_change: rating_change,
        holes_won: holesWon,
        holes_tied: holesTied,
        holes_lost: holesLost,
        winner_id: winnerId,
        playoffs: data.playoffs,
        notes: data.notes,
        tags: data.tags
      };

      
      const newMatch = await createMatch(matchData);
      if (newMatch) {
        router.push(`/matches`);
      }
    } catch (err) {
      console.error('Error creating match:', err);
      throw err; // Let the form handle the error
    }
  };
  
  // Show loading state while checking authentication or loading teams
  if (authLoading || teamsLoading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You need to be signed in to add new matches.</p>
        <Link 
          href="/matches"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Matches
        </Link>
      </div>
    );
  }

  // Show error if your team is not found
  if (!yourTeam) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
        <p className="mb-6">Please create your team first before creating a match.</p>
        <Link 
          href="/teams/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Your Team
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/matches" className="text-blue-600 hover:text-blue-800">
          ← Back to Matches
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">New Match</h1>
      
      {(matchError || teamsError) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{matchError?.message || teamsError?.message}</p>
            </div>
          </div>
        </div>
      )}
      
      <MatchForm
        yourTeam={yourTeam}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 