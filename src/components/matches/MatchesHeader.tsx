import React from 'react';
import { useRouter } from 'next/navigation';

interface MatchesHeaderProps {
  isAuthenticated: boolean;
}

export default function MatchesHeader({ isAuthenticated }: MatchesHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Match History</h1>
      
      {isAuthenticated && (
        <button
          onClick={() => router.push('/matches/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Match
        </button>
      )}
    </div>
  );
} 