import { HoleResult } from '@/types';
import MatchScorecard from '@/components/matches/MatchForm/MatchScorecard';
import { HoleResultData } from '@/hooks/useMatchForm';

interface EditMatchResultsProps {
  scorecardData: {
    course_id: string | null;
    hole_results: HoleResultData[];
    nine_played: 'front' | 'back';
  };
  onHoleResultChange: (holeNumber: number, result: HoleResult) => void;
  yourTeamName?: string;
  opponentTeamName?: string;
}

export default function EditMatchResults({
  scorecardData,
  onHoleResultChange,
  yourTeamName,
  opponentTeamName
}: EditMatchResultsProps) {
  return (
    <div className="bg-[--card-bg] rounded-lg border border-[--border] p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[--foreground]">Match Results</h3>
        <p className="mt-1 text-sm text-[--muted]">
          Update the hole results for this match.
        </p>
      </div>

      <div className="relative">
            {!scorecardData.course_id && (
          <div className="absolute inset-0 flex items-center justify-center bg-[--card-bg]/80 backdrop-blur-sm rounded-lg">
            <p className="text-[--muted] text-center">
              Please select a course to view and edit hole results
            </p>
          </div>
        )}
        
        <MatchScorecard
          courseId={scorecardData.course_id || ''}
          scorecardData={scorecardData}
          onHoleResultChange={onHoleResultChange}
          yourTeamName={yourTeamName}
          opponentTeamName={opponentTeamName}
        />
      </div>
    </div>
  );
} 