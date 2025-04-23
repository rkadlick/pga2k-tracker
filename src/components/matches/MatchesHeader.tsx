import React from 'react';
import { useRouter } from 'next/navigation';

interface MatchesHeaderProps {
  isAuthenticated: boolean;
}

export default function MatchesHeader({ isAuthenticated }: MatchesHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl text-[--foreground]">Match History</h1>
        <p className="mt-4 text-sm text-[--muted]">View and manage your match history.</p>
      </div>
      
      {isAuthenticated && (
        <button
          onClick={() => router.push('/matches/new')}
          className="inline-flex items-center"
        >
          Add New Match
        </button>
      )}
    </div>
  );
} 