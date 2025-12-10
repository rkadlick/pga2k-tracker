import React, { useCallback, useEffect, useState } from 'react';
import { Course, HoleResult, MatchScorecardProps, HoleResultData, CourseData } from '@/types';
import { useCourses } from '@/hooks/useCourses';

  

  

export default function MatchScorecard({ courseId, scorecardData, onHoleResultChange, yourTeamName, opponentTeamName }: MatchScorecardProps) {
  const [course, setCourse] = useState<CourseData>();
  const { getCourseById } = useCourses();
  const [loading, setLoading] = useState(true);

  // Memoize getCourseById
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetCourseById = useCallback(getCourseById, []);

  // Memoize the data transformation function
  const transformCourseData = useCallback((fetchedCourse: Course): CourseData => ({
    name: fetchedCourse.name,
    holes: fetchedCourse.holes?.map((hole: { hole_number: number; par: number; distance: number; }) => ({
      hole_number: hole.hole_number,
      par: hole.par,
      distance: hole.distance
    })) || []
  }), []);

  useEffect(() => {
    let isMounted = true;

    const fetchCourseData = async () => {
      if (!courseId) {
        setLoading(false);
        setCourse(undefined);
        return;
      }

      try {
        setLoading(true);
        const fetchedCourse = await memoizedGetCourseById(courseId);
        if (isMounted) {
          const transformedCourse = transformCourseData(fetchedCourse);
          setCourse(transformedCourse);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourseData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, memoizedGetCourseById]); // Only depend on courseId and memoized function

  if (loading) return <div className="text-[--muted]">Loading course data...</div>;
  if (!course && scorecardData.course_id) return null;

  const visibleHoles = course?.holes.slice(
    scorecardData.nine_played === 'front' ? 0 : 9,
    scorecardData.nine_played === 'front' ? 9 : 18
  ) || Array(9).fill(null).map((_, index) => ({
    hole_number: scorecardData.nine_played === 'front' ? index + 1 : index + 10,
    par: 0,
    distance: 0
  }));

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
        <table className="min-w-full border border-[--border] rounded-lg overflow-hidden" style={{ fontFamily: 'var(--font-tertiary)' }}>
          <thead>
            <tr className="bg-[--card-bg]">
              <th className="px-3 py-1.5 text-center text-sm font-medium text-[--muted] uppercase tracking-wider w-28">
                <div className="inline-block border-b border-[--border] mx-auto pb-0.5">Hole</div>
              </th>
              {visibleHoles.map(hole => (
                <th key={hole.hole_number} className="px-1 py-1.5 text-center text-sm font-medium text-[--muted] uppercase tracking-wider w-24">
                  <div className="inline-block border-b border-[--border] mx-auto pb-0.5">
                    {scorecardData.course_id ? hole.hole_number : '-'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[--input-bg]/50">
              <td className="px-3 py-1.5 whitespace-nowrap text-base font-medium text-[--foreground] text-center">
                <div className="inline-block border-b border-[--border]/30 mx-auto pb-0.5">Par</div>
              </td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-1 py-1.5 whitespace-nowrap text-center text-base text-purple-600 dark:text-purple-400 font-medium">
                  <div className="inline-block border-b border-[--border]/30 mx-auto pb-0.5">
                    {scorecardData.course_id ? hole.par : '-'}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="bg-[--input-bg]/30">
              <td className="px-3 py-1.5 whitespace-nowrap text-base font-medium text-[--foreground] text-center">
                <div className="inline-block border-b border-[--border]/30 mx-auto pb-0.5">Distance</div>
              </td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-1 py-1.5 whitespace-nowrap text-center text-base text-blue-600 dark:text-blue-400 font-medium">
                  <div className="inline-block border-b border-[--border]/30 mx-auto pb-0.5">
                    {scorecardData.course_id ? hole.distance : '-'}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-3 py-1.5 whitespace-nowrap text-base font-medium text-[--foreground] text-center">
                {yourTeamName || 'Your Team'}
              </td>
              {visibleHoles.map(hole => (
                <td key={hole.hole_number} className="px-1 py-1.5 whitespace-nowrap">
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
        <div className="bg-[--card-bg] rounded-lg p-3" style={{ fontFamily: 'var(--font-tertiary)' }}>
          <div className="grid grid-cols-3 gap-3 text-center mb-2">
            <div>
              <p className="text-sm text-[--muted] mb-0.5">Wins</p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">{status.wins}</p>
            </div>
            <div>
              <p className="text-sm text-[--muted] mb-0.5">Ties</p>
              <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">{status.ties}</p>
            </div>
            <div>
              <p className="text-sm text-[--muted] mb-0.5">Losses</p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">{status.losses}</p>
            </div>
          </div>
          <p className="text-center text-[--foreground] text-base font-medium">
            {status.message}
          </p>
        </div>
      )}
    </div>
  );
} 