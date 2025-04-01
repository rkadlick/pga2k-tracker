'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/useTeams';

interface Player {
  id: string;
  name: string;
  recent_rating: number;
}

interface TeamWithPlayers {
  id: string;
  name: string;
  is_your_team: boolean;
  players?: Player[];
}

export default function TeamDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const router = useRouter();
  const { teams, isLoading, error } = useTeams();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-[--primary] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-[--muted]">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 bg-rose-500/10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-rose-600 dark:text-rose-400">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-rose-700 dark:text-rose-300">{error instanceof Error ? error.message : 'An error occurred'}</p>
            <button
              onClick={() => router.push('/teams')}
              className="mt-4 inline-flex items-center px-3 py-1.5 text-sm rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
            >
              Back to Teams
            </button>
          </div>
        </div>
      </div>
    );
  }

  const team = teams.find(t => t.id === id) as TeamWithPlayers;

  if (!team) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[--muted] mb-4">Team not found</p>
        <button
          onClick={() => router.push('/teams')}
          className="inline-flex items-center px-4 py-2 text-sm rounded-xl bg-[--primary]/10 text-[--primary] hover:bg-[--primary]/20"
        >
          Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/teams')}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[--primary]/5 text-[--primary] hover:bg-[--primary]/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-[--foreground]">{team.name}</h2>
              {team.is_your_team && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400">
                  Your Team
                </span>
              )}
            </div>
          </div>

          {/* Players List */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.players?.map((player: Player) => (
              <div
                key={player.id}
                className="p-4 rounded-xl bg-[--background]/50 hover:bg-[--background]/75 transition-colors"
              >
                <h3 className="text-lg font-medium text-[--foreground]">{player.name}</h3>
                <p className="mt-2 text-sm text-[--muted]">Rating: {player.recent_rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Stats (coming soon) */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-[--foreground] mb-4">Team Stats</h3>
        <p className="text-[--muted]">Team statistics coming soon...</p>
      </div>
    </div>
  );
} 