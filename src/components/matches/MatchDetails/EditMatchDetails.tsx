
import { EditMatchDetailsProps } from '@/types';
import CourseSelect from '@/components/matches/MatchForm/CourseSelect';
import { useEffect } from 'react';

export default function EditMatchDetails({
  matchData,
  scorecardData,
  onInputChange,
  onCourseSelect,
  onNinePlayedChange,
  onPlayoffChange,
  yourTeamId,
  opponentTeamId
}: EditMatchDetailsProps) {
  // Helper to determine if a playoff result is selected
  const getPlayoffResult = (): 'win' | 'loss' | null => {
    if (!matchData.playoffs) return null;
    return matchData.winner_id === yourTeamId ? 'win' : 'loss';
  };

  // Calculate if playoffs buttons should be enabled
  const calculatePlayoffsEnabled = () => {
    // Get the relevant holes based on nine_played
    const relevantHoles = scorecardData.hole_results.filter(hr => {
      const holeNumber = hr.hole_number;
      if (scorecardData.nine_played === 'front') {
        return holeNumber >= 1 && holeNumber <= 9;
      } else {
        return holeNumber >= 10 && holeNumber <= 18;
      }
    });

    // Check if all 9 holes have results
    const allHolesHaveResults = relevantHoles.length === 9 && 
      relevantHoles.every(hr => hr.result !== null);

    if (!allHolesHaveResults) return false;

    // Calculate wins and losses
    const wins = relevantHoles.filter(hr => hr.result === 'win').length;
    const losses = relevantHoles.filter(hr => hr.result === 'loss').length;

    // Return true only if match is tied
    return wins === losses;
  };

  // Handle playoff button clicks
  const handlePlayoffClick = (result: 'win' | 'loss' | null) => {
    if (result === 'win') {
      onPlayoffChange(true, yourTeamId);
    } else if (result === 'loss') {
      onPlayoffChange(true, opponentTeamId);
    } else {
      onPlayoffChange(false, null);
    }
  };

  const playoffResult = getPlayoffResult();
  const playoffsEnabled = calculatePlayoffsEnabled();

  // Effect to clear playoffs when conditions aren't met
  useEffect(() => {
    if (!playoffsEnabled && matchData.playoffs) {
      onPlayoffChange(false, null);
    }
  }, [playoffsEnabled, matchData.playoffs, onPlayoffChange]);

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
            <CourseSelect
                selectedCourseId={scorecardData.course_id}
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
              value={scorecardData.nine_played}
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
            <label htmlFor="season" className="block text-sm font-medium text-[--foreground]">
              Season
            </label>
            <input
              type="number"
              name="season"
              id="season"
              value={matchData.season || 2}
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[--foreground]">
              Playoffs
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  disabled={!playoffsEnabled}
                  aria-pressed={playoffResult === 'win'}
                  onClick={() => handlePlayoffClick(playoffResult === 'win' ? null : 'win')}
                  className={`win w-7 h-7 flex items-center justify-center text-xs font-medium rounded ${
                    !playoffsEnabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  W
                </button>
                <button
                  type="button"
                  disabled={!playoffsEnabled}
                  aria-pressed={playoffResult === 'loss'}
                  onClick={() => handlePlayoffClick(playoffResult === 'loss' ? null : 'loss')}
                  className={`loss w-7 h-7 flex items-center justify-center text-xs font-medium rounded ${
                    !playoffsEnabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  L
                </button>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-[--foreground]">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              value={matchData.notes || ''}
              onChange={onInputChange}
              rows={3}
              className="w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
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