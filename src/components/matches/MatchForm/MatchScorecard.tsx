import React, { useEffect, useState } from 'react';
import { HoleResult } from '../../../types';
import { HoleResultData } from '../../../hooks/useMatchForm';

interface MatchFormData {
  hole_results: HoleResultData[];
  nine_played: 'front' | 'back';
  course_id: string | null;
}

interface MatchScorecardProps {
  courseId: string;
  formData: MatchFormData;
  onHoleResultChange: (holeNumber: number, result: HoleResult | null) => void;
  yourTeamName?: string;
  opponentTeamName?: string;
}

interface CourseData {
  name: string;
  holes: {
    hole_number: number;
    par: number;
    distance: number;
  }[];
}

export default function MatchScorecard({ courseId, formData, onHoleResultChange, yourTeamName, opponentTeamName }: MatchScorecardProps) {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        const data = await response.json();
        setCourseData(data.data);
      } catch (err) {
        setError('Failed to load course data');
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    } else {
      setLoading(false);
      setCourseData(null);
    }
  }, [courseId]);

  if (loading) return <div>Loading course data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!courseData && formData.course_id) return null;

  const visibleHoles = courseData?.holes.slice(
    formData.nine_played === 'front' ? 0 : 9,
    formData.nine_played === 'front' ? 9 : 18
  ) || Array(9).fill({ hole_number: 0, par: 0, distance: 0 });

  const renderHoleResultCell = (holeNumber: number, result: HoleResult | null) => {
    const isSelected = formData.hole_results.find((hr: HoleResultData) => hr.hole_number === holeNumber)?.result === result;
    const isDisabled = !formData.course_id;

    const bgColor = isSelected
      ? result === 'win'
        ? 'bg-green-600'
        : result === 'tie'
          ? 'bg-yellow-600'
          : 'bg-red-600'
      : 'bg-gray-200';

    const hoverColor = !isDisabled
      ? result === 'win'
        ? 'hover:bg-green-500'
        : result === 'tie'
          ? 'hover:bg-yellow-500'
          : 'hover:bg-red-500'
      : '';

    return (
      <button
        type="button"
        disabled={isDisabled}
        className={`px-2 py-1 text-xs font-medium rounded-md ${bgColor} ${hoverColor} ${
          isSelected ? 'text-white' : 'text-gray-700'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => onHoleResultChange(holeNumber, isSelected ? null : result)}
      >
        {result === 'win' ? 'W' : result === 'tie' ? 'T' : 'L'}
      </button>
    );
  };

  // Calculate match status
  const calculateMatchStatus = () => {
    if (!formData.course_id) return null;

    const results = formData.hole_results
      .filter(hr => visibleHoles.some(h => h.hole_number === hr.hole_number))
      .filter(hr => hr.result !== null);

    const wins = results.filter(hr => hr.result === 'win').length;
    const losses = results.filter(hr => hr.result === 'loss').length;

    const score = wins - losses;
    
    if (score === 0) return 'All Tied Up';
    return score > 0 
      ? `${yourTeamName || 'Dream Team'} is up ${Math.abs(score)}`
      : `${opponentTeamName || 'Opponent'} is up ${Math.abs(score)}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Match Scorecard {courseData?.name ? `- ${courseData.name}` : ''}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hole</th>
              {visibleHoles.map(hole => (
                <th key={hole.hole_number} className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {formData.course_id ? hole.hole_number : '-'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Par</td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                  {formData.course_id ? hole.par : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Distance</td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                  {formData.course_id ? hole.distance : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {yourTeamName || 'Your Team'}
              </td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-2 py-2 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-1">
                    {renderHoleResultCell(hole.hole_number, 'win')}
                    {renderHoleResultCell(hole.hole_number, 'tie')}
                    {renderHoleResultCell(hole.hole_number, 'loss')}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Match Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-center text-lg font-medium text-gray-900">
          {calculateMatchStatus() || '-'}
        </p>
      </div>
    </div>
  );
} 