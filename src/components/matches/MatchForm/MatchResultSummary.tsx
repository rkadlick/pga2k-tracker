import React from 'react';
import { MatchResultSummaryProps } from '@/types';

export default function MatchResultSummary({
  yourTeamId,
  opponentTeamId,
  yourTeamName,
  opponentTeamName,
  yourTeamScore,
  opponentTeamScore,
  margin,
  holeResults
}: MatchResultSummaryProps) {
  // Calculate display scores (convert back from integers to decimals)
  const getDisplayScore = (score: number) => score / 2;

  if (!yourTeamId || !opponentTeamId) return null;

  return (
    <div className="mt-6 bg-[--card-bg] border border-[--border] p-4 rounded-lg">
      <h3 className="font-medium text-[--foreground] mb-2">Match Result</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-[--muted]">{yourTeamName}</p>
          <p className="font-medium text-lg">{getDisplayScore(yourTeamScore)}</p>
        </div>
        <div>
          <p className="text-sm text-[--muted]">Ties</p>
          <p className="font-medium text-lg">
            {holeResults.filter(hr => hr.result === 'tie').length}
          </p>
        </div>
        <div>
          <p className="text-sm text-[--muted]">{opponentTeamName}</p>
          <p className="font-medium text-lg">{getDisplayScore(opponentTeamScore)}</p>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm text-[--foreground]">
          {yourTeamScore === opponentTeamScore
            ? 'Match is tied'
            : yourTeamScore > opponentTeamScore
            ? `${yourTeamName} leads by ${margin}`
            : `${opponentTeamName} leads by ${margin}`}
        </p>
      </div>
    </div>
  );
} 