import { useState } from 'react';
import { TeamMember } from '@/lib/api/teamClient';
import { generateTeamName, createTeam } from '@/lib/api/teamClient';

interface TeamCreationProps {
  onTeamCreated: (teamId: string, teamName: string) => void;
}

interface TeamMembers {
  member1: TeamMember;
  member2: TeamMember;
}

export default function TeamCreation({ onTeamCreated }: TeamCreationProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMembers>({
    member1: { name: '', rank: 0 },
    member2: { name: '', rank: 0 }
  });
  const [teamName, setTeamName] = useState('');
  const [teamCreationError, setTeamCreationError] = useState<string | null>(null);
  const [teamCreationSuccess, setTeamCreationSuccess] = useState(false);

  // Handle member input changes
  const handleMemberChange = (memberId: string, field: 'name' | 'rank', value: string) => {
    setTeamMembers(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId as keyof TeamMembers],
        [field]: field === 'rank' ? Number(value) || 0 : value
      }
    }));
  };

  // Generate random team name
  const generateRandomTeamName = async () => {
    try {
      const name = await generateTeamName();
      setTeamName(name);
    } catch (error) {
      console.error('Failed to generate team name:', error);
      setTeamCreationError('Failed to generate team name');
    }
  };

  // Handle team creation
  const handleCreateTeam = async () => {
    try {
      setTeamCreationError(null);

      const teamData = {
        name: teamName,
        members: [
          { name: teamMembers.member1.name, rank: teamMembers.member1.rank },
          { name: teamMembers.member2.name, rank: teamMembers.member2.rank }
        ],
        is_your_team: false
      };
      
      const newTeam = await createTeam(teamData);
      onTeamCreated(newTeam.id, teamName);
      setTeamCreationSuccess(true);
      
    } catch (error) {
      console.error('Failed to create team:', error);
      setTeamCreationError(error instanceof Error ? error.message : 'Failed to create team');
    }
  };

  if (teamCreationSuccess) {
    return (
      <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Team &quot;{teamName}&quot; created successfully! This team will be your opponent for the match.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Team</h3>
      
      {teamCreationError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{teamCreationError}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Team Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={teamName}
              readOnly
              className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Click generate to create team name"
            />
            <button
              type="button"
              onClick={generateRandomTeamName}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(teamMembers).map(([memberId, member]) => (
          <div key={memberId} className="space-y-3">
            <div>
              <label htmlFor={`${memberId}-name`} className="block text-sm font-medium text-gray-700">
                Member {memberId.slice(-1)} Name
              </label>
              <input
                type="text"
                id={`${memberId}-name`}
                value={member.name}
                onChange={(e) => handleMemberChange(memberId, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label htmlFor={`${memberId}-rank`} className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <input
                type="number"
                id={`${memberId}-rank`}
                value={member.rank}
                onChange={(e) => handleMemberChange(memberId, 'rank', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter rating"
                min="0"
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleCreateTeam}
          disabled={!teamName || !teamMembers.member1.name || !teamMembers.member2.name}
          className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Create Team
        </button>
      </div>
    </div>
  );
} 