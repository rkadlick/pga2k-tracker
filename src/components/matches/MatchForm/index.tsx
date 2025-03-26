'use client';

import { useState } from 'react';
import Scorecard from '@/components/common/Scorecard';
import { useMatchForm, MatchFormData } from '@/hooks/useMatchForm';
import { HoleResult, NinePlayed } from '@/types';
import { formatNinePlayed } from '@/utils/formatters';

interface MatchFormProps {
  onSubmit: (data: MatchFormData) => Promise<void>;
  onCancel: () => void;
}

export default function MatchForm({ onSubmit, onCancel }: MatchFormProps) {
  const {
    formData,
    teams,
    courses,
    courseData,
    isSubmitting,
    isLoadingData,
    errors,
    visibleHoles,
    handleInputChange,
    updateHoleResult,
    handleSubmit,
    yourTeamName,
    opponentTeamName
  } = useMatchForm(onSubmit);

  // Local state for tags input
  const [tagsInput, setTagsInput] = useState(formData.tags.join(', '));

  // Update tags when input changes
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Split by commas and trim
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  // Render a hole result cell with win/loss/tie buttons
  const renderHoleResultCell = (value: string | number | null, holeIndex: number, rowType: 'your_team' | 'tie' | 'opponent_team') => {
    const holeNumber = visibleHoles[holeIndex]?.hole_number || (holeIndex + 1);
    const result = formData.hole_results.find(hr => hr.hole_number === holeNumber)?.result;
    
    let isSelected = false;
    switch (rowType) {
      case 'your_team':
        isSelected = result === 'win';
        break;
      case 'tie':
        isSelected = result === 'tie';
        break;
      case 'opponent_team':
        isSelected = result === 'loss';
        break;
    }

    let buttonText = '';
    let resultType: HoleResult;
    switch (rowType) {
      case 'your_team':
        buttonText = 'W';
        resultType = 'win';
        break;
      case 'tie':
        buttonText = 'T';
        resultType = 'tie';
        break;
      case 'opponent_team':
        buttonText = 'L';
        resultType = 'loss';
        break;
    }

    return (
      <div className="flex justify-center items-center h-full">
        <button
          type="button"
          onClick={() => updateHoleResult(holeNumber, resultType)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium 
            ${isSelected 
              ? rowType === 'your_team'
                ? 'bg-green-500 text-white'
                : rowType === 'tie'
                  ? 'bg-gray-500 text-white'
                  : 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          title={`Mark hole as ${rowType === 'your_team' ? 'won' : rowType === 'tie' ? 'tied' : 'lost'}`}
        >
          {buttonText}
        </button>
      </div>
    );
  };

  // Calculate display scores (convert back from integers to decimals)
  const getDisplayScore = (score: number) => score / 2;

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

  // Prepare column configurations for scorecard
  const columns = courseData && formData.nine_played 
    ? visibleHoles.map(hole => ({
        label: hole.hole_number.toString()
      }))
    : Array(9).fill(null).map((_, i) => ({
        label: (i + 1).toString()
      }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      {/* Course Selection and Nine Played */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            id="course_id"
            value={formData.course_id}
            onChange={(e) => handleInputChange('course_id', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.fields.course_id ? 'border-red-300' : ''
            }`}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.fields.course_id && (
            <p className="mt-1 text-sm text-red-600">{errors.fields.course_id}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="nine_played" className="block text-sm font-medium text-gray-700">
            Nine Played
          </label>
          <select
            id="nine_played"
            value={formData.nine_played}
            onChange={(e) => handleInputChange('nine_played', e.target.value as NinePlayed)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="front">Front 9</option>
            <option value="back">Back 9</option>
            <option value="full">Full 18</option>
          </select>
        </div>
      </div>

      {/* Scorecard */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {courseData ? `${courseData.name} - ${formatNinePlayed(formData.nine_played)} Scorecard` : 'Scorecard'}
        </h3>
        
        {errors.fields.hole_results && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{errors.fields.hole_results}</p>
          </div>
        )}
        
        <Scorecard 
          columns={columns}
          rows={[
            {
              id: 'par',
              type: 'par',
              label: 'Par',
              values: courseData && formData.nine_played ? visibleHoles.map(hole => hole.par) : Array(9).fill('-'),
              total: courseData && formData.nine_played ? visibleHoles.reduce((sum, hole) => sum + hole.par, 0) : '-'
            },
            {
              id: 'distance',
              type: 'distance',
              label: 'Yards',
              values: courseData && formData.nine_played ? visibleHoles.map(hole => hole.distance) : Array(9).fill('-'),
              total: courseData && formData.nine_played ? visibleHoles.reduce((sum, hole) => sum + hole.distance, 0) : '-'
            },
            {
              id: 'your_team',
              type: 'match',
              label: yourTeamName || 'Your Team',
              values: formData.hole_results.map(hr => hr.result),
              renderCell: (value, index) => renderHoleResultCell(value, index, 'your_team'),
              total: ''
            },
            {
              id: 'tie',
              type: 'match',
              label: 'Tie',
              values: formData.hole_results.map(hr => hr.result),
              renderCell: (value, index) => renderHoleResultCell(value, index, 'tie'),
              total: `${getDisplayScore(formData.your_team_score)} - ${getDisplayScore(formData.opponent_team_score)}`
            },
            {
              id: 'opponent_team',
              type: 'match',
              label: opponentTeamName || 'Opponent Team',
              values: formData.hole_results.map(hr => hr.result),
              renderCell: (value, index) => renderHoleResultCell(value, index, 'opponent_team'),
              total: ''
            }
          ]}
        />
      </div>

      {/* Match Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Match Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Match Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="date_played" className="block text-sm font-medium text-gray-700">
                Date Played
              </label>
              <input
                type="date"
                id="date_played"
                value={formData.date_played}
                onChange={(e) => handleInputChange('date_played', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.fields.date_played ? 'border-red-300' : ''
                }`}
                required
              />
              {errors.fields.date_played && (
                <p className="mt-1 text-sm text-red-600">{errors.fields.date_played}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="your_team_id" className="block text-sm font-medium text-gray-700">
                Your Team
              </label>
              <select
                id="your_team_id"
                value={formData.your_team_id}
                onChange={(e) => handleInputChange('your_team_id', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.fields.your_team_id ? 'border-red-300' : ''
                }`}
                required
              >
                <option value="">Select your team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.fields.your_team_id && (
                <p className="mt-1 text-sm text-red-600">{errors.fields.your_team_id}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="opponent_team_id" className="block text-sm font-medium text-gray-700">
                Opponent Team
              </label>
              <select
                id="opponent_team_id"
                value={formData.opponent_team_id}
                onChange={(e) => handleInputChange('opponent_team_id', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.fields.opponent_team_id ? 'border-red-300' : ''
                }`}
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
              {errors.fields.opponent_team_id && (
                <p className="mt-1 text-sm text-red-600">{errors.fields.opponent_team_id}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="rating_change" className="block text-sm font-medium text-gray-700">
                Rating Change
              </label>
              <input
                type="text"
                id="rating_change"
                value={formData.rating_change}
                onChange={(e) => handleInputChange('rating_change', e.target.value)}
                placeholder="e.g. '3 & 2' or 'by 2 holes'"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="playoffs"
                checked={formData.playoffs}
                onChange={(e) => handleInputChange('playoffs', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="playoffs" className="ml-2 block text-sm text-gray-700">
                Playoff Match
              </label>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (optional, comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="e.g. important, comeback, birdie"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Match Result Summary */}
      {formData.your_team_id && formData.opponent_team_id && (
        <div className="mt-6 bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">Match Result</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-blue-700">{yourTeamName}</p>
              <p className="font-medium text-lg">{getDisplayScore(formData.your_team_score)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Ties</p>
              <p className="font-medium text-lg">
                {formData.hole_results.filter(hr => hr.result === 'tie').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700">{opponentTeamName}</p>
              <p className="font-medium text-lg">{getDisplayScore(formData.opponent_team_score)}</p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm text-blue-700">
              {formData.your_team_score === formData.opponent_team_score
                ? 'Match is tied'
                : formData.your_team_score > formData.opponent_team_score
                ? `${yourTeamName} leads by ${formData.margin}`
                : `${opponentTeamName} leads by ${formData.margin}`}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Match'}
        </button>
      </div>
    </form>
  );
}
