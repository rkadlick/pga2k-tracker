'use client';

import React, { useState, useEffect } from 'react';
import { Team } from '@/lib/api/teamClient';
import * as teamClient from '@/lib/api/teamClient';
import { useMatchForm, MatchFormData } from '../../../hooks/useMatchForm';
import CourseSelect from './CourseSelect';
import TeamCreation from './TeamCreation';
import MatchScorecard from './MatchScorecard';
import MatchDetails from './MatchDetails';

interface MatchFormProps {
  yourTeam: Team;
  onSubmit: (formData: MatchFormData) => void;
}

interface TeamPlayerDetails {
  name: string;
  recent_rating: number;
}

export default function MatchForm({ yourTeam, onSubmit }: MatchFormProps) {
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayerDetails[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Team | null>(null);
  const {
    formData,
    updateFormData,
    setYourTeamPlayers,
    setOpponentTeam: setOpponentTeamId,
    setOpponentTeamPlayers: setOpponentTeamPlayersId,
    setCourse,
    updateHoleResult,
    resetForm,
  } = useMatchForm();

  useEffect(() => {
    async function fetchTeamPlayers() {
      if (!yourTeam) return;
      
      setIsLoadingPlayers(true);
      setPlayerError(null);
      try {
        const players = await teamClient.getTeamPlayers(yourTeam.id);
        setTeamPlayers(players);
        setYourTeamPlayers(players);
      } catch (error) {
        console.error('Error fetching team players:', error);
        setPlayerError('Failed to load team players');
      } finally {
        setIsLoadingPlayers(false);
      }
    }

    fetchTeamPlayers();
  }, [yourTeam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
    setOpponentTeam(null);
  };

  const handleOpponentTeamCreated = async (teamId: string) => {
    try {
      const team = await teamClient.fetchTeam(teamId);
      setOpponentTeam(team);
      setOpponentTeamId(teamId);

      const players = await teamClient.getTeamPlayers(teamId);
      setOpponentTeamPlayersId(players);
      
    } catch (error) {
      console.error('Error fetching opponent team:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Match Setup Section */}
      <div className="bg-[--card-bg] border border-[--border] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[--foreground] mb-6">Match Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[--foreground]">
              Date Played
              <input
                type="date"
                value={formData.date_played}
                onChange={(e) => updateFormData('date_played', e.target.value)}
                className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                         focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                         transition-all duration-200"
                required
              />
            </label>
          </div>
        
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[--foreground]">
              Nine Played
              <select
                value={formData.nine_played}
                onChange={(e) => updateFormData('nine_played', e.target.value as 'front' | 'back')}
                className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                         focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                         transition-all duration-200"
                required
              >
                <option value="front">Front Nine</option>
                <option value="back">Back Nine</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <CourseSelect
            selectedCourseId={formData.course_id}
            onCourseSelect={setCourse}
          />
        </div>
      </div>

      {/* Teams Section - Only show if course is selected */}
      {formData.course_id && (
        <div className="bg-[--card-bg] border border-[--border] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[--foreground] mb-6">Teams</h2>
          <div className="space-y-6">
            <div className="p-4 bg-[--input-bg] rounded-lg border border-[--border]">
              <h3 className="text-lg font-medium text-[--foreground]">{yourTeam.name}</h3>
              <div className="mt-2 space-y-1">
                {isLoadingPlayers ? (
                  <p className="text-[--muted]">Loading team players...</p>
                ) : playerError ? (
                  <p className="text-red-600 dark:text-red-400">{playerError}</p>
                ) : (
                  <ul className="list-disc pl-6 text-[--muted]">
                    {teamPlayers.map((player, index) => (
                      <li key={index}>
                        {player.name} - Rating: {player.recent_rating}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-[--input-bg] rounded-lg border border-[--border]">
              <TeamCreation
                isYourTeam={false}
                onTeamCreated={handleOpponentTeamCreated}
              />
            </div>
          </div>
        </div>
      )}

      {/* Scorecard and Match Details - Only show if both course and opponent team are selected */}
      {formData.course_id && formData.opponent_team_id && (
        <>
          <div className="bg-[--card-bg] border border-[--border] rounded-lg p-6">
            <MatchScorecard
              courseId={formData.course_id}
              formData={formData}
              onHoleResultChange={updateHoleResult}
              yourTeamName={yourTeam.name}
              opponentTeamName={opponentTeam?.name}
            />
          </div>

          <div className="bg-[--card-bg] border border-[--border] rounded-lg p-6">
            <MatchDetails
              ratingChange={formData.rating_change}
              playoffs={formData.playoffs}
              notes={formData.notes}
              tags={formData.tags}
              onInputChange={updateFormData}
              holeResults={formData.hole_results}
              ninePlayed={formData.nine_played}
              yourTeamId={yourTeam.id}
              opponentTeamId={formData.opponent_team_id || ''}
              formData={formData}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="button"
            >
              Create Match
            </button>
          </div>
        </>
      )}
    </form>
  );
}
