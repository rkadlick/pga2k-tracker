'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { Match, HoleResult, NinePlayed } from '@/types';
import { validateMatchUpdateData } from '@/lib/validation/matchValidation';
import { useTeams } from '@/hooks/useTeams';
import { HoleResultData } from '@/hooks/useMatchForm';
import EditMatchHeader from '@/components/matches/MatchDetails/EditMatchHeader';
import ValidationErrors from '@/components/common/ValidationErrors';
import EditMatchDetails from '@/components/matches/MatchDetails/EditMatchDetails';
import EditMatchResults from '@/components/matches/MatchDetails/EditMatchResults';

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
      nine_played: value.toUpperCase() as NinePlayed
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

  const handlePlayoffChange = (isPlayoff: boolean, winnerId: string | null) => {
    setMatchData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        playoffs: isPlayoff,
        winner_id: winnerId
      };
    });
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-[--primary] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
          <p className="text-[--muted]">Loading match details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-fade-in">
        <EditMatchHeader
          matchId={matchId || ''}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        {validationErrors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r-lg">
            <ValidationErrors errors={validationErrors} />
          </div>
        )}

        <div className="space-y-8">
          <EditMatchDetails
            matchData={matchData}
            formData={formData}
            onInputChange={handleInputChange}
            onCourseSelect={handleCourseSelect}
            onNinePlayedChange={handleNinePlayedChange}
            onPlayoffChange={handlePlayoffChange}
            yourTeamId={yourTeam?.id || ''}
            opponentTeamId={matchData.opponent_team_id || ''}
          />

          <EditMatchResults
            formData={formData}
            onHoleResultChange={handleHoleResultChange}
            yourTeamName={matchData.your_team}
            opponentTeamName={matchData.opponent_team}
          />
        </div>
      </div>
    </div>
  );
} 