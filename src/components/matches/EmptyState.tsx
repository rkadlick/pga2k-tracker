import React from 'react';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  isAuthenticated: boolean;
}

export default function EmptyState({ isAuthenticated }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <p className="text-gray-500">No matches found.</p>
      {isAuthenticated && (
        <button
          onClick={() => router.push('/matches/new')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Your First Match
        </button>
      )}
    </div>
  );
} 