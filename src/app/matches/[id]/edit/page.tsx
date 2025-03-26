'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { Match, NinePlayed } from '@/types';
import { validateMatchUpdateData } from '@/lib/validation/matchValidation';
import Link from 'next/link';

export default function EditMatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getMatch, updateMatch, isLoading, error } = useMatches();
  
  const [matchData, setMatchData] = useState<Partial<Match> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchMatch = async () => {
      if (matchId) {
        const fetchedMatch = await getMatch(matchId);
        if (fetchedMatch) {
          setMatchData(fetchedMatch);
        }
      }
    };

    fetchMatch();
  }, [matchId, getMatch]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setMatchData(prev => {
      if (!prev) return prev;
      
      if (type === 'number') {
        return { ...prev, [name]: value ? Number(value) : null };
      } else if (name === 'playoffs') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else if (name === 'tags') {
        // Split by commas and trim
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
        return { ...prev, [name]: tags };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matchData) return;
    
    // Validate the form data
    const errors = validateMatchUpdateData(matchData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors([]);
    
    try {
      // Determine winner_id based on scores
      let winnerId = null;
      if (matchData.your_team_score !== undefined && matchData.opponent_team_score !== undefined) {
        if (matchData.your_team_score > matchData.opponent_team_score) {
          winnerId = matchData.your_team_id;
        } else if (matchData.your_team_score < matchData.opponent_team_score) {
          winnerId = matchData.opponent_team_id;
        }
        // If scores are equal, winnerId remains null (tie)
      }
      
      // Calculate margin if needed
      let margin = undefined;
      if (matchData.your_team_score !== undefined && matchData.opponent_team_score !== undefined) {
        margin = Math.abs(matchData.your_team_score - matchData.opponent_team_score);
      }
      
      await updateMatch(matchId, {
        ...matchData,
        winner_id: winnerId,
        margin: margin
      });
      
      router.push(`/matches/${matchId}`);
    } catch (err) {
      console.error('Error updating match:', err);
      setValidationErrors(['Failed to update match. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !matchData) {
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/matches/${matchId}`} className="text-blue-600 hover:text-blue-800">
          ← Back to Match
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Match</h1>
      
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="date_played" className="block text-sm font-medium text-gray-700 mb-1">
            Date Played
          </label>
          <input
            type="date"
            id="date_played"
            name="date_played"
            value={matchData.date_played ? matchData.date_played.split('T')[0] : ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <input
            type="text"
            id="course_id"
            name="course_id"
            value={matchData.course_id || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            Course cannot be changed. Create a new match if needed.
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="nine_played" className="block text-sm font-medium text-gray-700 mb-1">
            Nine Played
          </label>
          <select
            id="nine_played"
            name="nine_played"
            value={matchData.nine_played || 'front'}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="front">Front 9</option>
            <option value="back">Back 9</option>
            <option value="full">Full 18</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="your_team_id" className="block text-sm font-medium text-gray-700 mb-1">
            Your Team
          </label>
          <input
            type="text"
            id="your_team_id"
            name="your_team_id"
            value={matchData.your_team_id || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            Teams cannot be changed. Create a new match if needed.
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="opponent_team_id" className="block text-sm font-medium text-gray-700 mb-1">
            Opponent Team
          </label>
          <input
            type="text"
            id="opponent_team_id"
            name="opponent_team_id"
            value={matchData.opponent_team_id || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="your_team_score" className="block text-sm font-medium text-gray-700 mb-1">
              Your Team Score
            </label>
            <input
              type="number"
              id="your_team_score"
              name="your_team_score"
              value={matchData.your_team_score !== undefined ? matchData.your_team_score : ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="opponent_team_score" className="block text-sm font-medium text-gray-700 mb-1">
              Opponent Team Score
            </label>
            <input
              type="number"
              id="opponent_team_score"
              name="opponent_team_score"
              value={matchData.opponent_team_score !== undefined ? matchData.opponent_team_score : ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="rating_change" className="block text-sm font-medium text-gray-700 mb-1">
            Score Description (optional)
          </label>
          <input
            type="text"
            id="rating_change"
            name="rating_change"
            value={matchData.rating_change || ''}
            onChange={handleInputChange}
            placeholder="e.g. '3 & 2' or 'by 2 holes'"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="playoffs"
              name="playoffs"
              checked={matchData.playoffs || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="playoffs" className="ml-2 block text-sm text-gray-700">
              Playoff Match
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={matchData.notes || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (optional, comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={matchData.tags ? matchData.tags.join(', ') : ''}
            onChange={handleInputChange}
            placeholder="e.g. important, comeback, birdie"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link 
            href={`/matches/${matchId}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 