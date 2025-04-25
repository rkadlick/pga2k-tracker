import { Course, Hole, Match } from '@/types';
import Scorecard from '@/components/common/Scorecard';
import { getName } from '@/utils/nameHelpers';

interface MatchScorecardSectionProps {
  match: Match;
  course: Course;
}

export default function MatchScorecardSection({ match, course }: MatchScorecardSectionProps) {
  // Prepare scorecard data
  const yourTeamName = getName(match.your_team);
  const opponentTeamName = getName(match.opponent_team);

  const visibleHoles = course.holes?.slice(
    match.nine_played === 'front' ? 0 : 9,
    match.nine_played === 'front' ? 9 : 18
  );

  const scorecardColumns = [
    { id: 'label', label: '', className: 'w-28' },
    ...(visibleHoles?.map((hole: Hole) => ({
      id: `hole-${hole.hole_number}`,
      label: hole.hole_number.toString(),
      className: 'w-24'
    })) || []),
    { id: 'total', label: 'Total', className: 'w-24' }
  ];

  const scorecardRows = [
    {
      id: 'par',
      type: 'par' as const,
      label: 'Par',
      values: visibleHoles?.map((hole: Hole) => hole.par) || [],
      total: visibleHoles?.reduce((sum: number, hole: Hole) => sum + hole.par, 0) || 0,
      className: 'bg-[--input-bg]/50'
    },
    {
      id: 'distance',
      type: 'distance' as const,
      label: 'Distance',
      values: visibleHoles?.map((hole: Hole) => hole.distance) || [],
      total: visibleHoles?.reduce((sum: number, hole: Hole) => sum + (hole.distance || 0), 0) || 0,
      className: 'bg-[--input-bg]/30'
    },
    {
      id: 'results',
      type: 'match' as const,
      label: 'Result',
      values: visibleHoles?.map((hole: Hole) => {
        const result = match.hole_results?.find(hr => hr.hole_number === hole.hole_number)?.result;
        return result ? (result === 'win' ? 'W' : result === 'loss' ? 'L' : 'T') : '-';
      }) || [],
      total: `${match.holes_won}-${match.holes_lost}-${match.holes_tied}`
    }
  ];

  const getMatchStatusColor = () => {
    if (match.winner_id === match.your_team_id) {
      return 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400';
    } else {  
      return 'bg-rose-600/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400';
    }
  };

  return (
    <div className="space-y-6 font-tertiary">
      <div>
        <h3 className="text-xl font-semibold text-[--foreground] font-primary">
          Hole Results
        </h3>
      </div>
      <div>
        <Scorecard
          columns={scorecardColumns}
          rows={scorecardRows}
          className="border-[--border] rounded-lg overflow-hidden"
        />
      </div>

      {/* Match Status */}
      <div className="bg-[--card-bg] rounded-lg p-3">
        <div className="grid grid-cols-3 gap-3 text-center mb-3">
          <div>
            <p className="text-sm text-[--muted] mb-0.5">Wins</p>
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{match.holes_won}</p>
          </div>
          <div>
            <p className="text-sm text-[--muted] mb-0.5">Ties</p>
            <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">{match.holes_tied}</p>
          </div>
          <div>
            <p className="text-sm text-[--muted] mb-0.5">Losses</p>
            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400">{match.holes_lost}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchStatusColor()}`}>
            {match.winner_id === match.your_team_id ? `${yourTeamName} Won!` : `${opponentTeamName} Won`}
          </span>
        </div>
      </div>
    </div>
  );
} 