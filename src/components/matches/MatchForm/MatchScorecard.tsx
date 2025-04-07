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
  scorecardData: MatchFormData;
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

export default function MatchScorecard({ courseId, scorecardData, onHoleResultChange, yourTeamName, opponentTeamName }: MatchScorecardProps) {
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

  if (loading) return <div className="text-[--muted]">Loading course data...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;
  if (!courseData && scorecardData.course_id) return null;

  const visibleHoles = courseData?.holes.slice(
    scorecardData.nine_played === 'front' ? 0 : 9,
    scorecardData.nine_played === 'front' ? 9 : 18
  ) || Array(9).fill({ hole_number: 0, par: 0, distance: 0 });

  const renderHoleResultCell = (holeNumber: number, result: HoleResult | null) => {
    const isSelected = scorecardData.hole_results.find((hr: HoleResultData) => hr.hole_number === holeNumber)?.result === result;
    const isDisabled = !scorecardData.course_id;

    const baseClasses = "w-7 h-7 flex items-center justify-center text-xs font-medium rounded transition-colors duration-200";
    const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
    
    return (
      <button
        type="button"
        disabled={isDisabled}
        aria-pressed={isSelected}
        className={`${baseClasses} ${disabledClasses} ${
          result === 'win' ? 'win' : result === 'tie' ? 'tie' : 'loss'
        }`}
        onClick={() => onHoleResultChange(holeNumber, isSelected ? null : result)}
      >
        {result === 'win' ? 'W' : result === 'tie' ? 'T' : 'L'}
      </button>
    );
  };

  // Calculate match status
  const calculateMatchStatus = () => {
    if (!scorecardData.course_id) return null;

    const results = scorecardData.hole_results
      .filter(hr => visibleHoles.some(h => h.hole_number === hr.hole_number))
      .filter(hr => hr.result !== null);

    const wins = results.filter(hr => hr.result === 'win').length;
    const losses = results.filter(hr => hr.result === 'loss').length;
    const ties = results.filter(hr => hr.result === 'tie').length;

    const score = wins - losses;
    
    return {
      wins,
      losses,
      ties,
      message: score === 0 
        ? 'All Tied Up'
        : score > 0 
          ? `${yourTeamName || 'Dream Team'} is up ${Math.abs(score)}`
          : `${opponentTeamName || 'Opponent'} is up ${Math.abs(score)}`
    };
  };

  const status = calculateMatchStatus();

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[--border] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[--card-bg]">
              <th className="px-3 py-1.5 text-left text-xs font-medium text-[--muted] uppercase tracking-wider w-28">Hole</th>
              {visibleHoles.map(hole => (
                <th key={hole.hole_number} className="px-1 py-1.5 text-center text-xs font-medium text-[--muted] uppercase tracking-wider w-24">
                  {scorecardData.course_id ? hole.hole_number : '-'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            <tr className="bg-[--input-bg]/50">
              <td className="px-3 py-1.5 whitespace-nowrap text-sm font-medium text-[--foreground]">Par</td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-1 py-1.5 whitespace-nowrap text-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {scorecardData.course_id ? hole.par : '-'}
                </td>
              ))}
            </tr>
            <tr className="bg-[--input-bg]/30">
              <td className="px-3 py-1.5 whitespace-nowrap text-sm font-medium text-[--foreground]">Dist</td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-1 py-1.5 whitespace-nowrap text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {scorecardData.course_id ? hole.distance : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-[--foreground]">
                {yourTeamName || 'Your Team'}
              </td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-1 py-2.5 whitespace-nowrap">
                  <div className="flex justify-center gap-0.5">
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
      {status && (
        <div className="bg-[--card-bg] rounded-lg p-3">
          <div className="grid grid-cols-3 gap-3 text-center mb-2">
            <div>
              <p className="text-xs text-[--muted] mb-0.5">Wins</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{status.wins}</p>
            </div>
            <div>
              <p className="text-xs text-[--muted] mb-0.5">Ties</p>
              <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{status.ties}</p>
            </div>
            <div>
              <p className="text-xs text-[--muted] mb-0.5">Losses</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">{status.losses}</p>
            </div>
          </div>
          <p className="text-center text-[--foreground] text-sm font-medium">
            {status.message}
          </p>
        </div>
      )}
    </div>
  );
} 