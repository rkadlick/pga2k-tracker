'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { Match, HoleResult, NinePlayed } from '@/types';
import { validateMatchUpdateData } from '@/lib/validation/matchValidation';
import Link from 'next/link';
import MatchScorecard from '@/components/matches/MatchForm/MatchScorecard';
import CourseSelect from '@/components/matches/MatchForm/CourseSelect';
import { useTeams } from '@/hooks/useTeams';
import { HoleResultData } from '@/hooks/useMatchForm';

interface MatchUpdateData {
  date_played?: string;
  course_id?: string;
  your_team_id?: string;
  opponent_team_id?: string;
  nine_played?: NinePlayed;
  holes_won?: number;
  holes_tied?: number;
  holes_lost?: number;
  winner_id?: string | null;
  rating_change?: number;
  playoffs?: boolean;
  notes?: string;
  tags?: string[];
  hole_results?: Array<{
    hole_number: number;
    result: HoleResult;
  }>;
}

interface FormData {
  hole_results: HoleResultData[];
  nine_played: 'front' | 'back';
  course_id: string | null;
}

export default function EditMatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getMatchById, updateMatch, isLoading: matchLoading } = useMatches();
  const { teams, isLoading: teamsLoading } = useTeams();
  
  const [matchData, setMatchData] = useState<Partial<Match> | null>(null);
  const [formData, setFormData] = useState<FormData>({
    hole_results: [],
    nine_played: 'front',
    course_id: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [holeResultsModified, setHoleResultsModified] = useState(false);

  const yourTeam = teams.find(team => team.is_your_team);
  

  useEffect(() => {
    const fetchMatch = async () => {
      if (matchId) {
        const fetchedMatch = await getMatchById(matchId);
        if (fetchedMatch) {
          const ninePlayed = (fetchedMatch.nine_played || 'front').toLowerCase() as 'front' | 'back';
          const holeResults = fetchedMatch.hole_results?.map(hr => ({
            hole_number: hr.hole_number,
            result: hr.result
          })) || [];

          setMatchData(fetchedMatch);
          setFormData({
            hole_results: holeResults,
            nine_played: ninePlayed,
            course_id: fetchedMatch.course_id || null
          });
        }
      }
    };

    fetchMatch();
  }, [matchId, getMatchById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setMatchData(prev => {
      if (!prev) return prev;
      
      if (type === 'number') {
        return { ...prev, [name]: value ? Number(value) : null };
      } else if (name === 'playoffs') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else if (name === 'tags') {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
        return { ...prev, [name]: tags };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleCourseSelect = (courseId: string | null) => {
    setMatchData(prev => {
      if (!prev) return prev;
      return { ...prev, course_id: courseId || undefined };
    });
    setFormData(prev => ({
      ...prev,
      course_id: courseId,
      hole_results: []
    }));
  };

  const handleNinePlayedChange = (value: 'front' | 'back') => {
    setMatchData(prev => ({
      ...prev!,
      nine_played: value as NinePlayed
    }));
    
    // Clear hole results when switching nines
    setFormData(prev => ({
      ...prev,
      nine_played: value,
      hole_results: [] // Reset hole results
    }));

    // Mark as modified since we're clearing results
    setHoleResultsModified(true);
  };

  const handleHoleResultChange = (holeNumber: number, result: HoleResult) => {
    setHoleResultsModified(true);
    const newHoleResults = [...formData.hole_results];
    const holeIndex = newHoleResults.findIndex(hr => hr.hole_number === holeNumber);
    
    if (holeIndex >= 0) {
      newHoleResults[holeIndex] = { hole_number: holeNumber, result };
    } else {
      newHoleResults.push({ hole_number: holeNumber, result });
    }

    setFormData(prev => ({
      ...prev,
      hole_results: newHoleResults
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchData || !matchId) return;
    const errors = validateMatchUpdateData(matchData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors([]);
    
    try {
      if (!yourTeam) {
        throw new Error('Your team not found');
      }

      if (!matchData.course_id) {
        throw new Error('Course not selected');
      }

      if (!matchData.opponent_team_id) {
        throw new Error('Opponent team not selected');
      }

      // Verify that hole results are not empty
      if (formData.hole_results.length === 0) {
        setValidationErrors(['Please enter hole results before saving']);
        setIsSubmitting(false);
        return;
      }

      // Calculate holes won, lost, tied from hole results
      const counts = formData.hole_results.reduce((acc: { holesWon: number; holesLost: number; holesTied: number }, hr) => {
        if (hr.result === 'win') return { ...acc, holesWon: acc.holesWon + 1 };
        if (hr.result === 'loss') return { ...acc, holesLost: acc.holesLost + 1 };
        if (hr.result === 'tie') return { ...acc, holesTied: acc.holesTied + 1 };
        return acc;
      }, { holesWon: 0, holesLost: 0, holesTied: 0 });

      // Calculate winner based on holes
      const yourTeamScore = counts.holesWon + (counts.holesTied * 0.5);
      const opponentTeamScore = counts.holesLost + (counts.holesTied * 0.5);

      const winnerId = yourTeamScore > opponentTeamScore 
        ? yourTeam.id 
        : opponentTeamScore > yourTeamScore 
          ? matchData.opponent_team_id 
          : null;
      
      // Calculate rating change
      let rating_change = matchData.rating_change || 0;
      if (winnerId !== yourTeam.id) {
        rating_change = 0 - Math.abs(rating_change);
      } else {
        rating_change = Math.abs(rating_change);
      }

      const updatedMatchData: MatchUpdateData = {
        date_played: matchData.date_played,
        course_id: matchData.course_id,
        nine_played: matchData.nine_played as NinePlayed,
        opponent_team_id: matchData.opponent_team_id,
        holes_won: counts.holesWon,
        holes_tied: counts.holesTied,
        holes_lost: counts.holesLost,
        winner_id: winnerId,
        rating_change: rating_change,
        playoffs: matchData.playoffs,
        notes: matchData.notes,
        tags: matchData.tags,
        ...(holeResultsModified ? { 
          hole_results: formData.hole_results
        } : {})
      };

      console.log('updatedMatchData', updatedMatchData);
      
      await updateMatch(matchId, updatedMatchData);
      router.push(`/matches/${matchId}`);
    } catch (err) {
      console.error('Error updating match:', err);
      setValidationErrors(['Failed to update match. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (matchLoading || teamsLoading || !matchData) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-600">Loading match details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Edit Match</h1>
          <div className="space-x-4">
            <Link href={`/matches/${matchId}`} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">There were errors with your submission</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Match Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update the details for this match.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Course
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <CourseSelect
                    selectedCourseId={formData.course_id}
                    onCourseSelect={handleCourseSelect}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="nine_played" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Nine Played
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    id="nine_played"
                    name="nine_played"
                    value={formData.nine_played}
                    onChange={(e) => handleNinePlayedChange(e.target.value as 'front' | 'back')}
                    className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="front">Front 9</option>
                    <option value="back">Back 9</option>
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="date_played" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Date Played
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="date"
                    name="date_played"
                    id="date_played"
                    value={matchData.date_played || ''}
                    onChange={handleInputChange}
                    className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="rating_change" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Rating Change
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="rating_change"
                    id="rating_change"
                    value={Math.abs(matchData.rating_change || 0)}
                    onChange={handleInputChange}
                    className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="playoffs" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Playoffs
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="playoffs"
                    id="playoffs"
                    checked={matchData.playoffs || false}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Notes
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    value={matchData.notes || ''}
                    onChange={handleInputChange}
                    className="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Tags
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={matchData.tags?.join(', ') || ''}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                    className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Match Results</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update the hole results for this match.
              </p>
            </div>

            <div className="mt-6">
              {formData.course_id && (
                <MatchScorecard
                  courseId={formData.course_id}
                  formData={formData}
                  onHoleResultChange={handleHoleResultChange}
                  yourTeamName={matchData.your_team}
                  opponentTeamName={matchData.opponent_team}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 