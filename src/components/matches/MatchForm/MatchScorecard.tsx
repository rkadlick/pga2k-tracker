import React, { useEffect, useState } from 'react';
import { HoleResult } from '../../../types';
import { HoleResultData } from '../../../hooks/useMatchForm';

interface MatchFormData {
  hole_results: HoleResultData[];
}

interface MatchScorecardProps {
  courseId: string;
  formData: MatchFormData;
  onHoleResultChange: (holeNumber: number, result: HoleResult | null) => void;
  yourTeamName?: string;
}

interface CourseData {
  name: string;
  holes: {
    hole_number: number;
    par: number;
    distance: number;
  }[];
}

export default function MatchScorecard({ courseId, formData, onHoleResultChange, yourTeamName }: MatchScorecardProps) {
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

    fetchCourseData();
  }, [courseId]);

  if (loading) return <div>Loading course data...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!courseData) return null;

  const visibleHoles = courseData.holes.slice(0, 9);

  const renderHoleResultCell = (holeNumber: number, result: HoleResult | null) => {
    const isSelected = formData.hole_results.find((hr: HoleResultData) => hr.hole_number === holeNumber)?.result === result;
    return (
      <button
        type="button"
        className={`px-4 py-2 rounded-md ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => onHoleResultChange(holeNumber, result)}
      >
        {result === 'win' ? 'W' : result === 'tie' ? 'T' : 'L'}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Match Scorecard - {courseData.name}</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hole</th>
              {visibleHoles.map(hole => (
                <th key={hole.hole_number} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {hole.hole_number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Par</td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {hole.par}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Distance</td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {hole.distance}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {yourTeamName || 'Your Team'}
              </td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
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
    </div>
  );
} 