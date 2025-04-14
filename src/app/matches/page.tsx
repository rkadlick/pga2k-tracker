'use client';

import React from 'react';
import { useMatches } from '@/hooks/useMatches';
import { useAuth } from '@/hooks/useAuth';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import MatchesHeader from '@/components/matches/MatchesHeader';
import EmptyState from '@/components/matches/EmptyState';
import MatchList from '@/components/matches/MatchList';

export default function MatchesPage() {
  const { isAuthenticated } = useAuth();
  const { matches, isLoading, error } = useMatches();
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <MatchesHeader isAuthenticated={isAuthenticated} />
      
      {error && <ErrorState message={error.message} />}
      
      {isLoading ? (
        <LoadingState message="Loading matches..." />
      ) : matches.length === 0 ? (
        <EmptyState isAuthenticated={isAuthenticated} />
      ) : (
        <MatchList matches={matches} />
      )}
    </div>
  );
}
