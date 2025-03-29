import { Match } from '@/types';
import CourseSelect from '@/components/matches/MatchForm/CourseSelect';

interface EditMatchDetailsProps {
  matchData: Partial<Match>;
  formData: {
    course_id: string | null;
    nine_played: 'front' | 'back';
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCourseSelect: (courseId: string | null) => void;
  onNinePlayedChange: (value: 'front' | 'back') => void;
}

export default function EditMatchDetails({
  matchData,
  formData,
  onInputChange,
  onCourseSelect,
  onNinePlayedChange
}: EditMatchDetailsProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[--card-bg] rounded-lg border border-[--border] p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[--foreground]">Match Details</h3>
          <p className="mt-1 text-sm text-[--muted]">
            Update the details for this match.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label htmlFor="course" className="block text-sm font-medium text-[--foreground]">
              Course
            </label>
            <CourseSelect
              selectedCourseId={formData.course_id}
              onCourseSelect={onCourseSelect}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nine_played" className="block text-sm font-medium text-[--foreground]">
              Nine Played
            </label>
            <select
              id="nine_played"
              name="nine_played"
              value={formData.nine_played}
              onChange={(e) => onNinePlayedChange(e.target.value as 'front' | 'back')}
              className="w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
            >
              <option value="front">Front 9</option>
              <option value="back">Back 9</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="date_played" className="block text-sm font-medium text-[--foreground]">
              Date Played
            </label>
            <input
              type="date"
              name="date_played"
              id="date_played"
              value={matchData.date_played ? matchData.date_played.split('T')[0] : ''}
              onChange={onInputChange}
              className="w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rating_change" className="block text-sm font-medium text-[--foreground]">
              Rating Change
            </label>
            <input
              type="number"
              name="rating_change"
              id="rating_change"
              value={Math.abs(matchData.rating_change || 0)}
              onChange={onInputChange}
              className="w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="playoffs"
              id="playoffs"
              checked={matchData.playoffs || false}
              onChange={onInputChange}
              className="h-4 w-4 bg-[--input-bg] border border-[--input-border] text-[--primary] rounded
                       focus:ring-[--primary] focus:ring-offset-[--background]
                       transition-colors duration-200"
            />
            <label htmlFor="playoffs" className="text-sm font-medium text-[--foreground]">
              Playoffs
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-[--foreground]">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={matchData.notes || ''}
              onChange={onInputChange}
              className="w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
              placeholder="Add any notes about this match..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium text-[--foreground]">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={matchData.tags?.join(', ') || ''}
              onChange={onInputChange}
              placeholder="Enter tags separated by commas"
              className="w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 