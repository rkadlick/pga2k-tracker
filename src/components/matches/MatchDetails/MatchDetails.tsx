import { Match } from '@/types';

interface MatchDetailsProps {
  match: Match;
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <div className="space-y-4" style={{ fontFamily: 'var(--font-tertiary)' }}>
      <h3 className="text-xl font-semibold text-[--foreground]" style={{ fontFamily: 'var(--font-primary)' }}>Notes</h3>
      <div className="text-sm text-[--muted]">
        {match.notes}
      </div>
    </div>
  );
}
