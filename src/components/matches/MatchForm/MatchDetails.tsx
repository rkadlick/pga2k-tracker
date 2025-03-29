import React from 'react';
import { MatchFormData, HoleResultData } from '../../../hooks/useMatchForm';

interface MatchDetailsProps {
  ratingChange: number;
  playoffs: boolean;
  notes: string;
  tags: string[];
  onInputChange: <K extends keyof MatchFormData>(field: K, value: MatchFormData[K]) => void;
  holeResults: HoleResultData[];
  ninePlayed: 'front' | 'back';
  yourTeamId: string;
  opponentTeamId: string;
  formData: MatchFormData;
}

export default function MatchDetails({
  ratingChange,
  playoffs,
  notes,
  tags,
  onInputChange,
  holeResults,
  ninePlayed,
  yourTeamId,
  opponentTeamId,
  formData
}: MatchDetailsProps) {
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onInputChange('tags', newTags);
  };

  // Calculate if playoffs buttons should be enabled
  const calculatePlayoffsEnabled = () => {
    // Get the relevant holes based on nine_played
    const relevantHoles = holeResults.filter(hr => {
      const holeNumber = hr.hole_number;
      if (ninePlayed === 'front') {
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

  const playoffsEnabled = calculatePlayoffsEnabled();

  // Helper to determine if a playoff result is selected
  const getPlayoffResult = (): 'win' | 'loss' | null => {
    if (!playoffs) return null;
    return formData.winner_id === yourTeamId ? 'win' : 'loss';
  };

  // Handle playoff button clicks
  const handlePlayoffClick = (result: 'win' | 'loss' | null) => {
    if (!result) {
      // If deselecting, clear both playoffs and winner_id
      onInputChange('playoffs', false);
      onInputChange('winner_id', null);
    } else {
      // Set playoffs to true and set winner based on W/L selection
      onInputChange('playoffs', true);
      onInputChange('winner_id', result === 'win' ? yourTeamId : opponentTeamId);
    }
  };

  const playoffResult = getPlayoffResult();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[--foreground]">Match Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[--foreground]">
            Rating Change
            <input
              type="number"
              value={ratingChange}
              onChange={(e) => onInputChange('rating_change', parseInt(e.target.value, 10) || 0)}
              className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
            />
          </label>
        </div>
        
        <div>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-[--foreground]">
          Notes
          <textarea
            value={notes}
            onChange={(e) => onInputChange('notes', e.target.value)}
            rows={3}
            className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                     focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                     transition-all duration-200"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[--foreground]">
          Tags
          <input
            type="text"
            value={tags.join(', ')}
            onChange={handleTagsChange}
            placeholder="Enter tags separated by commas"
            className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                     focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                     transition-all duration-200"
          />
        </label>
      </div>
    </div>
  );
} 