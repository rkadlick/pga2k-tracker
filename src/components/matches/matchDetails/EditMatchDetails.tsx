import { Match, NinePlayed } from '@/types';
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
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6 sm:space-y-5">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Match Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update the details for this match.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Course
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <CourseSelect
                selectedCourseId={formData.course_id}
                onCourseSelect={onCourseSelect}
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="nine_played" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Nine Played
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <select
                id="nine_played"
                name="nine_played"
                value={formData.nine_played}
                onChange={(e) => onNinePlayedChange(e.target.value as 'front' | 'back')}
                className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              >
                <option value="front">Front 9</option>
                <option value="back">Back 9</option>
              </select>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="date_played" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Date Played
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="date"
                name="date_played"
                id="date_played"
                value={matchData.date_played ? matchData.date_played.split('T')[0] : ''}
                onChange={onInputChange}
                className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="rating_change" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Rating Change
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="number"
                name="rating_change"
                id="rating_change"
                value={Math.abs(matchData.rating_change || 0)}
                onChange={onInputChange}
                className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="playoffs" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Playoffs
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="checkbox"
                name="playoffs"
                id="playoffs"
                checked={matchData.playoffs || false}
                onChange={onInputChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Notes
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <textarea
                name="notes"
                id="notes"
                rows={3}
                value={matchData.notes || ''}
                onChange={onInputChange}
                className="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Tags
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="tags"
                id="tags"
                value={matchData.tags?.join(', ') || ''}
                onChange={onInputChange}
                placeholder="Enter tags separated by commas"
                className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 