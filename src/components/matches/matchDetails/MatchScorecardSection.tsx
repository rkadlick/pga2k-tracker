import { Course, Hole, Match } from '@/types';
import Scorecard from '@/components/common/Scorecard';

interface MatchScorecardSectionProps {
  match: Match;
  course: Course;
}

const formatNinePlayed = (nine: string) => {
  return nine === 'front' ? 'Front 9' : 'Back 9';
};

export default function MatchScorecardSection({ match, course }: MatchScorecardSectionProps) {
  // Prepare scorecard data
  const visibleHoles = course.holes?.slice(
    match.nine_played === 'front' ? 0 : 9,
    match.nine_played === 'front' ? 9 : 18
  );

  const scorecardColumns = [
    { id: 'label', label: '', className: 'w-24' },
    ...visibleHoles.map((hole: Hole) => ({
      id: `hole-${hole.hole_number}`,
      label: hole.hole_number.toString(),
      className: 'w-16'
    })),
    { id: 'total', label: 'Total', className: 'w-24' }
  ];

  const scorecardRows = [
    {
      id: 'par',
      type: 'par' as const,
      label: 'Par',
      values: visibleHoles.map((hole: Hole) => hole.par),
      total: visibleHoles.reduce((sum: number, hole: Hole) => sum + hole.par, 0)
    },
    {
      id: 'distance',
      type: 'distance' as const,
      label: 'Distance',
      values: visibleHoles.map((hole: Hole) => hole.distance),
      total: visibleHoles.reduce((sum: number, hole: Hole) => sum + hole.distance, 0)
    },
    {
      id: 'results',
      type: 'match' as const,
      label: 'Result',
      values: visibleHoles.map((hole: Hole) => {
        const result = match.hole_results?.find(hr => hr.hole_number === hole.hole_number)?.result;
        return result ? (result === 'win' ? 'W' : result === 'loss' ? 'L' : 'T') : '-';
      }),
      total: `${match.holes_won}-${match.holes_lost}-${match.holes_tied}`
    }
  ];

  return (
    <div className="bg-[--card-bg] border border-[--border] overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-semibold text-[--foreground]">
          Hole Results
        </h3>
        <p className="mt-1 text-sm text-[--muted]">
          {match.course} - {formatNinePlayed(match.nine_played)}
        </p>
      </div>
      <div className="border-t border-[--border]">
        <Scorecard
          columns={scorecardColumns}
          rows={scorecardRows}
        />
      </div>
    </div>
  );
} 