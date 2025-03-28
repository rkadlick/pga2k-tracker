import Link from 'next/link';

interface MatchHeaderProps {
  matchId: string;
  onEdit: () => void;
}

export default function MatchHeader({ matchId, onEdit }: MatchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Link href="/matches" className="text-blue-600 hover:text-blue-800">
        ← Back to Matches
      </Link>
      <button
        onClick={onEdit}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Edit Match
      </button>
    </div>
  );
} 