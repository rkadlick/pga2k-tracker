import { HoleResult } from '@/types';
import MatchScorecard from '@/components/matches/MatchForm/MatchScorecard';
import { HoleResultData } from '@/hooks/useMatchForm';

interface EditMatchResultsProps {
  formData: {
    course_id: string | null;
    hole_results: HoleResultData[];
    nine_played: 'front' | 'back';
  };
  onHoleResultChange: (holeNumber: number, result: HoleResult) => void;
  yourTeamName?: string;
  opponentTeamName?: string;
}

export default function EditMatchResults({
  formData,
  onHoleResultChange,
  yourTeamName,
  opponentTeamName
}: EditMatchResultsProps) {
  return (
    <div className="pt-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Match Results</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Update the hole results for this match.
        </p>
      </div>

      <div className="mt-6">
        {formData.course_id && (
          <MatchScorecard
            courseId={formData.course_id}
            formData={formData}
            onHoleResultChange={onHoleResultChange}
            yourTeamName={yourTeamName}
            opponentTeamName={opponentTeamName}
          />
        )}
      </div>
    </div>
  );
} 