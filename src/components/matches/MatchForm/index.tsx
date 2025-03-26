'use client';

import React from 'react';
import { Course, HoleResult } from '@/types';
import { useMatchForm, MatchFormData } from '@/hooks/useMatchForm';
import TeamCreation from './TeamCreation';
import MatchDetails from './MatchDetails';
import MatchResultSummary from './MatchResultSummary';
import Scorecard from '@/components/common/Scorecard';

interface MatchFormProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
  onSubmit: (data: MatchFormData) => Promise<void>;
}

export default function MatchForm({ courses, loading, error, onSubmit }: MatchFormProps) {
  const {
    formData,
    courseData,
    visibleHoles,
    handleInputChange,
    handleSubmit,
    updateHoleResult,
    yourTeamName,
    opponentTeamName,
    setOpponentTeamName
  } = useMatchForm(onSubmit);

  const renderHoleResultCell = (value: string | number | null, index: number, rowType: 'your_team' | 'tie' | 'opponent_team') => {
    if (!formData.your_team_id || !formData.opponent_team_id) return null;

    const result = formData.hole_results[index]?.result;
    const isSelected = result === rowType;

    return (
      <button
        type="button"
        className={`px-4 py-2 rounded-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => updateHoleResult(index + 1, rowType as HoleResult)}
      >
        {rowType === 'your_team' ? 'W' : rowType === 'tie' ? 'T' : 'L'}
      </button>
    );
  };

  const columns = [
    { label: 'Hole', className: 'w-24' },
    ...visibleHoles.map(hole => ({ 
      label: hole.hole_number.toString(),
      className: 'w-16'
    }))
  ];

  const rows = [
    {
      id: 'par',
      type: 'par' as const,
      label: 'Par',
      values: courseData ? visibleHoles.map(hole => hole.par) : Array(9).fill(''),
      total: courseData ? visibleHoles.reduce((sum, hole) => sum + hole.par, 0) : ''
    },
    {
      id: 'distance',
      type: 'distance' as const,
      label: 'Yards',
      values: courseData ? visibleHoles.map(hole => hole.distance) : Array(9).fill(''),
      total: courseData ? visibleHoles.reduce((sum, hole) => sum + hole.distance, 0) : ''
    },
    {
      id: 'your_team',
      type: 'match' as const,
      label: yourTeamName || 'Your Team',
      values: formData.hole_results.map(hr => hr.result as string | null),
      renderCell: (value: string | number | null, index: number) => renderHoleResultCell(value, index, 'your_team'),
      total: ''
    },
    {
      id: 'tie',
      type: 'match' as const,
      label: 'Tie',
      values: formData.hole_results.map(hr => hr.result as string | null),
      renderCell: (value: string | number | null, index: number) => renderHoleResultCell(value, index, 'tie'),
      total: `${formData.your_team_score / 2} - ${formData.opponent_team_score / 2}`
    },
    {
      id: 'opponent_team',
      type: 'match' as const,
      label: opponentTeamName || 'Opponent Team',
      values: formData.hole_results.map(hr => hr.result as string | null),
      renderCell: (value: string | number | null, index: number) => renderHoleResultCell(value, index, 'opponent_team'),
      total: ''
    }
  ];

  const handleTeamCreated = (teamId: string, teamName: string) => {
    handleInputChange('opponent_team_id', teamId);
    setOpponentTeamName(teamName);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="date_played" className="block text-sm font-medium text-gray-700">
              Date Played
            </label>
            <input
              type="date"
              id="date_played"
              value={formData.date_played}
              onChange={(e) => handleInputChange('date_played', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              id="course_id"
              value={formData.course_id}
              onChange={(e) => handleInputChange('course_id', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TeamCreation onTeamCreated={handleTeamCreated} />

        {formData.your_team_id && formData.opponent_team_id && formData.course_id && (
          <>
            <Scorecard
              columns={columns}
              rows={rows}
            />

            <MatchDetails
              ratingChange={formData.rating_change ? Number(formData.rating_change) : null}
              playoffs={formData.playoffs}
              notes={formData.notes}
              tags={formData.tags}
              onInputChange={(field: string, value: string | number | boolean | string[]) => {
                handleInputChange(field as keyof MatchFormData, value);
              }}
            />

            <MatchResultSummary
              yourTeamId={formData.your_team_id}
              opponentTeamId={formData.opponent_team_id}
              yourTeamName={yourTeamName}
              opponentTeamName={opponentTeamName}
              yourTeamScore={formData.your_team_score}
              opponentTeamScore={formData.opponent_team_score}
              margin={formData.margin}
              holeResults={formData.hole_results}
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Match
            </button>
          </>
        )}
      </div>
    </form>
  );
}
