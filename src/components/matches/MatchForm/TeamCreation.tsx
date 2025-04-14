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
  const [isGeneratingName, setIsGeneratingName] = useState(false);

  const handleGenerateTeamName = async () => {
    setIsGeneratingName(true);
    setErrorMessage(null);
    
    try {
      let attempts = 0;
      let name: string;
      let exists: boolean;
      
      // Try up to 5 times to get a unique name
      do {
        name = await teamClient.generateTeamName();
        exists = await teamClient.checkTeamNameExists(name);
        attempts++;
      } while (exists && attempts < 5);
      
      if (exists) {
        // If we couldn't find a unique name after 5 attempts, add a random number
        name = `${name} ${Math.floor(Math.random() * 100)}`;
      }
      
      updateTeamName(name);
    } catch (error) {
      console.error('Error generating team name:', error);
      setErrorMessage('Failed to generate team name');
    } finally {
      setIsGeneratingName(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!isValid) return;

    try {
      setStatus('loading');
      setErrorMessage(null);

      // Check if team name exists
      const exists = await teamClient.checkTeamNameExists(formData.name);
      if (exists) {
        setErrorMessage('This team name is already taken. Please generate a new one.');
        setStatus('idle');
        return;
      }

      const result = await teamClient.createTeam({
        name: formData.name,
        players: formData.members.map(m => ({
          name: m.name,
          rating: m.rank
        })),
        is_your_team: isYourTeam,
        playerIds: formData.members.map(m => m.id)
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
              <div className="relative mt-1">
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  placeholder="Click 'Generate' to create team name"
                  className="block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                           focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                           transition-all duration-200 cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[--muted]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </label>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerateTeamName}
              disabled={isGeneratingName}
              className="inline-flex items-center px-4 py-2 border border-[--input-border] text-sm font-medium rounded-lg text-[--foreground] bg-[--input-bg] hover:bg-[--hover-bg] 
                       focus:outline-none focus:ring-1 focus:ring-[--input-focus]
                       transition-all duration-200 disabled:opacity-50"
            >
              {isGeneratingName ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[--foreground]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Name'
              )}
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
                  className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                           focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                           transition-all duration-200"
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
                  className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                           focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                           transition-all duration-200"
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