import React, { useState } from 'react';
import { useTeamForm } from '@/hooks/useTeamForm';
import * as teamClient from '@/lib/api/teamClient';

interface TeamCreationProps {
  isYourTeam: boolean;
  onTeamCreated: (teamId: string) => void;
}

export default function TeamCreation({ isYourTeam, onTeamCreated }: TeamCreationProps) {
  const { formData, updateMemberField, updateTeamName, resetForm, isValid } = useTeamForm();
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'created' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [foundTeam, setFoundTeam] = useState<{ name: string; players: { name: string; recent_rating: number; }[] } | null>(null);

  const handleGenerateTeamName = async () => {
    try {
      const name = await teamClient.generateTeamName();
      updateTeamName(name);
    } catch (error) {
      console.error('Error generating team name:', error);
      setErrorMessage('Failed to generate team name');
    }
  };

  const handleCreateTeam = async () => {
    if (!isValid) return;

    try {
      setStatus('loading');
      setErrorMessage(null);

      const result = await teamClient.createTeam({
        name: formData.name,
        players: formData.members.map(m => ({
          name: m.name,
          rating: m.rank
        })),
        is_your_team: isYourTeam
      });

      const players = await teamClient.getTeamPlayers(result.team.id);
      setFoundTeam({
        name: result.team.name,
        players
      });

      setStatus(result.wasExisting ? 'found' : 'created');
      onTeamCreated(result.team.id);
      resetForm();
    } catch (error) {
      console.error('Error creating team:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create team');
    }
  };

  if ((status === 'found' || status === 'created') && foundTeam) {
    return (
      <div className="space-y-4">
        <div className={`p-4 ${status === 'found' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'} rounded-md`}>
          <p>
            {status === 'found' ? 'Team found! Player ratings have been updated.' : 'Team created successfully!'}
          </p>
        </div>

        <div className="p-4 bg-[--input-bg] rounded-lg border border-[--border]">
          <h3 className="text-lg font-medium text-[--foreground]">{foundTeam.name}</h3>
          <div className="mt-2 space-y-1">
            <ul className="list-disc pl-6 text-[--muted]">
              {foundTeam.players.map((player, index) => (
                <li key={index}>
                  {player.name} - Rating: {player.recent_rating}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[--foreground]">Create Opponent Team</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[--foreground]">
              Team Name
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateTeamName(e.target.value)}
                className="mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm"
                required
              />
            </label>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerateTeamName}
              className="inline-flex items-center px-4 py-2 border border-[--border] text-sm font-medium rounded-lg text-[--foreground] bg-[--input-bg] hover:bg-[--hover-bg] focus:outline-none focus:ring-2 focus:ring-[--primary]"
            >
              Generate
            </button>
          </div>
        </div>

        {formData.members.map((member, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[--foreground]">
                Player {index + 1} Name
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMemberField(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-[--foreground]">
                Rating
                <input
                  type="number"
                  value={member.rank}
                  onChange={(e) => updateMemberField(index, 'rank', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm"
                  required
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreateTeam}
          disabled={!isValid || status === 'loading'}
          className="button"
        >
          {status === 'loading' ? 'Creating...' : 'Create Team'}
        </button>
      </div>

      {status === 'error' && errorMessage && (
        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </div>
  );
} 