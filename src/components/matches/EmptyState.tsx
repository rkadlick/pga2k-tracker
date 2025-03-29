import React from 'react';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  isAuthenticated: boolean;
}

export default function EmptyState({ isAuthenticated }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12 bg-[--card-bg] border border-[--border] rounded-lg">
      <p className="text-[--muted]">No matches found.</p>
      {isAuthenticated && (
        <button
          onClick={() => router.push('/matches/new')}
          className="button mt-4 inline-flex items-center"
        >
          Add Your First Match
        </button>
      )}
    </div>
  );
} 