'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { NinePlayed } from '@/types';
import { validateMatchData } from '@/lib/validation/matchValidation';
import Link from 'next/link';

export default function NewMatchPage() {
  const router = useRouter();
  const { createMatch, isCreating, error } = useMatches();
  
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    date_played: new Date().toISOString().split('T')[0],
    course_id: '',
    your_team_id: '',
    opponent_team_id: '',
    nine_played: 'front' as NinePlayed,
    your_team_score: 0,
    opponent_team_score: 0,
    score_description: '',
    margin: 0,
    playoffs: false,
    notes: '',
    tags: [] as string[],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch teams
        const teamsResponse = await fetch('/api/teams');
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
        
        // Fetch courses
        const coursesResponse = await fetch('/api/courses');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        
        // Set default values if data is available
        if (teamsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            your_team_id: teamsData[0].id
          }));
        }
        
        if (coursesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            course_id: coursesData[0].id
          }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : 0 }));
    } else if (name === 'playoffs') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'tags') {
      // Split by commas and trim
      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({ ...prev, [name]: tags }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate winner_id based on scores
    let winnerId = null;
    const yourScore = formData.your_team_score;
    const opponentScore = formData.opponent_team_score;
    
    if (yourScore > opponentScore) {
      winnerId = formData.your_team_id;
    } else if (yourScore < opponentScore) {
      winnerId = formData.opponent_team_id;
    }
    // If scores are equal, winnerId remains null (tie)
    
    // Calculate margin
    const margin = Math.abs(yourScore - opponentScore);
    
    const matchData = {
      ...formData,
      winner_id: winnerId,
      margin: margin
    };
    
    // Validate the match data
    const errors = validateMatchData(matchData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      const newMatch = await createMatch(matchData);
      if (newMatch) {
        router.push(`/matches/${newMatch.id}`);
      }
    } catch (err) {
      console.error('Error creating match:', err);
      setValidationErrors(['Failed to create match. Please try again.']);
    }
  };
  
  if (isLoadingData) {
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
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/matches" className="text-blue-600 hover:text-blue-800">
          ← Back to Matches
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">New Match</h1>
      
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
            value={formData.date_played}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            id="course_id"
            name="course_id"
            value={formData.course_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="nine_played" className="block text-sm font-medium text-gray-700 mb-1">
            Nine Played
          </label>
          <select
            id="nine_played"
            name="nine_played"
            value={formData.nine_played}
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
          <select
            id="your_team_id"
            name="your_team_id"
            value={formData.your_team_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select your team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="opponent_team_id" className="block text-sm font-medium text-gray-700 mb-1">
            Opponent Team
          </label>
          <select
            id="opponent_team_id"
            name="opponent_team_id"
            value={formData.opponent_team_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select opponent team</option>
            {teams
              .filter(team => team.id !== formData.your_team_id)
              .map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
          </select>
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
              value={formData.your_team_score}
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
              value={formData.opponent_team_score}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="score_description" className="block text-sm font-medium text-gray-700 mb-1">
            Score Description (optional)
          </label>
          <input
            type="text"
            id="score_description"
            name="score_description"
            value={formData.score_description}
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
              checked={formData.playoffs}
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
            value={formData.notes}
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
            value={formData.tags.join(', ')}
            onChange={handleInputChange}
            placeholder="e.g. important, comeback, birdie"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link 
            href="/matches"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isCreating ? 'Creating...' : 'Create Match'}
          </button>
        </div>
      </form>
    </div>
  );
} 