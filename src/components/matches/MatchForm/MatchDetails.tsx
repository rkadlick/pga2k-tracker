import React, { useState } from 'react';
import { MatchDetailsProps } from '@/types';



export default function MatchDetails({
  season,
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
  const [isEditingSeason, setIsEditingSeason] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<number | ''>(season || 2);

  const handleSeasonSubmit = () => {
    if (currentSeason !== '') {
      onInputChange('season', currentSeason);
    }
    setIsEditingSeason(false);
  };

  const handleSeasonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSeasonSubmit();
    } else if (e.key === 'Escape') {
      setCurrentSeason(season || 2);
      setIsEditingSeason(false);
    }
  };

  const handleSeasonEdit = () => {
    setCurrentSeason(season || 2);
    setIsEditingSeason(true);
  };

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

      <div className="flex items-center gap-2 relative">
        {isEditingSeason ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSeasonSubmit}
              className="p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold
              ${currentSeason === 1 ? 'text-[var(--season-1)] bg-[var(--season-1-bg)]' :
                currentSeason === 2 ? 'text-[var(--season-2)] bg-[var(--season-2-bg)]' :
                currentSeason === 3 ? 'text-[var(--season-3)] bg-[var(--season-3-bg)]' :
                currentSeason === 4 ? 'text-[var(--season-4)] bg-[var(--season-4-bg)]' :
                'text-[var(--season-5)] bg-[var(--season-5-bg)]'}`}>
              <span className="text-[var(--foreground)]">SEASON</span>
              <input
                type="number"
                value={currentSeason}
                onChange={(e) => setCurrentSeason(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                onBlur={handleSeasonSubmit}
                onKeyDown={handleSeasonKeyDown}
                autoFocus
                style={{ height: '24px', lineHeight: '24px' }}
                className="w-16 bg-transparent text-[var(--foreground)] text-sm font-bold tracking-wide focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ml-1"
              />
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSeasonEdit}
              className="p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold
              ${formData.season === 1 ? 'text-[var(--season-1)] bg-[var(--season-1-bg)]' :
                formData.season === 2 ? 'text-[var(--season-2)] bg-[var(--season-2-bg)]' :
                formData.season === 3 ? 'text-[var(--season-3)] bg-[var(--season-3-bg)]' :
                formData.season === 4 ? 'text-[var(--season-4)] bg-[var(--season-4-bg)]' :
                'text-[var(--season-5)] bg-[var(--season-5-bg)]'}`}>
              SEASON {formData.season || 2}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[--foreground]">
            Rating Change
            <input
              type="number"
              min="0"
              value={Math.abs(ratingChange)}
              onChange={(e) => onInputChange('rating_change', Math.abs(parseInt(e.target.value, 10)) || 0)}
              className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                       focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[--foreground]">
            Playoffs
            </label>
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