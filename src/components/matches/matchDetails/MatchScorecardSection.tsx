import { Match, NinePlayed } from '@/types';
import Scorecard from '@/components/common/Scorecard';

interface CourseHole {
  hole_number: number;
  par: number;
  distance: number;
}

interface CourseData {
  name: string;
  holes: CourseHole[];
}

interface MatchScorecardSectionProps {
  match: Match;
  courseData: CourseData;
}

function formatNinePlayed(ninePlayed: NinePlayed): string {
  switch (ninePlayed) {
    case 'front':
      return 'Front 9';
    case 'back':
      return 'Back 9';
    case 'all':
      return 'Full 18';
    default:
      return ninePlayed;
  }
}

export default function MatchScorecardSection({ match, courseData }: MatchScorecardSectionProps) {
  // Prepare scorecard data
  const visibleHoles = courseData.holes.slice(
    match.nine_played === 'front' ? 0 : 9,
    match.nine_played === 'front' ? 9 : 18
  );

  const scorecardColumns = [
    { id: 'label', label: '', className: 'w-24' },
    ...visibleHoles.map((hole: CourseHole) => ({
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
      values: visibleHoles.map((hole: CourseHole) => hole.par),
      total: visibleHoles.reduce((sum: number, hole: CourseHole) => sum + hole.par, 0)
    },
    {
      id: 'distance',
      type: 'distance' as const,
      label: 'Distance',
      values: visibleHoles.map((hole: CourseHole) => hole.distance),
      total: visibleHoles.reduce((sum: number, hole: CourseHole) => sum + hole.distance, 0)
    },
    {
      id: 'results',
      type: 'match' as const,
      label: 'Result',
      values: visibleHoles.map((hole: CourseHole) => {
        const result = match.hole_results?.find(hr => hr.hole_number === hole.hole_number)?.result;
        return result ? (result === 'win' ? 'W' : result === 'loss' ? 'L' : 'T') : '-';
      }),
      total: `${match.holes_won}-${match.holes_lost}-${match.holes_tied}`
    }
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Hole Results
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <Scorecard
          title={`${match.course} - ${formatNinePlayed(match.nine_played)}`}
          columns={scorecardColumns}
          rows={scorecardRows}
        />
      </div>
    </div>
  );
} 