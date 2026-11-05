'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import MatchList from '@/components/matches/MatchList';
import { Match } from '@/types';

function getTeamStats(teamId: string, matches: Match[]) {
  const wins = matches.filter(match => match.winner_id === teamId).length;

  // Hole totals are stored from our team's side, so flip them for opponents
  const holes = matches.reduce(
    (totals, match) => {
      const isYourTeam = match.your_team_id === teamId;
      return {
        won: totals.won + (isYourTeam ? match.holes_won : match.holes_lost),
        tied: totals.tied + match.holes_tied,
        lost: totals.lost + (isYourTeam ? match.holes_lost : match.holes_won)
      };
    },
    { won: 0, tied: 0, lost: 0 }
  );

  return [
    { label: 'Matches', value: matches.length },
    { label: 'Record', value: `${wins}-${matches.length - wins}` },
    { label: 'Win Rate', value: matches.length ? `${Math.round((wins / matches.length) * 100)}%` : '-' },
    { label: 'Holes (W-T-L)', value: `${holes.won}-${holes.tied}-${holes.lost}` }
  ];
}

export default function TeamDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const router = useRouter();
  const { teams, isLoading: isLoadingTeams, error: teamsError } = useTeams();
  const { matches: allMatches, isLoading: isLoadingMatches, error: matchesError } = useMatches();

  if (isLoadingTeams || isLoadingMatches) {
    return <LoadingState message="Loading team details..." />;
  }

  const error = teamsError || matchesError;
  if (error) {
    return <ErrorState message={error.message} />;
  }

  const team = teams.find(t => t.id === id);

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

  const matches = allMatches.filter(match =>
    match.your_team_id === id || match.opponent_team_id === id
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb outside card */}
      <div onClick={() => router.push('/teams')} className="breadcrumb">
        <IoArrowBack className="breadcrumb-icon" />
        <span className="breadcrumb-text">Back to Teams</span>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>
              {team.name}
            </h2>
            {team.is_your_team && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400">
                Our Team
              </span>
            )}
          </div>

          {/* Players List */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.players?.map(player => (
              <div
                key={player.id}
                className="p-4 rounded-xl bg-[var(--background)]/80"
              >
                <h3 className="text-lg font-medium text-[--foreground] break-words">{player.name}</h3>
                <p className="mt-2 text-sm text-[--muted]">Rating: {player.recent_rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-primary)' }}>Team Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {getTeamStats(id, matches).map(stat => (
              <div key={stat.label}>
                <p className="text-sm text-[--muted]" style={{ fontFamily: 'var(--font-tertiary)' }}>{stat.label}</p>
                <p className="text-2xl font-bold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match History */}
      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : (
        <div className="card p-6 text-center">
          <p className="text-[--muted]">No matches recorded for this team.</p>
        </div>
      )}
    </div>
  );
}
