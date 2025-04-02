import Link from 'next/link';

interface MatchHeaderProps {
  matchId: string;
  onEdit: () => void;
  isAuthenticated: boolean;
}

export default function MatchHeader({ matchId, onEdit, isAuthenticated }: MatchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Link 
        href="/matches" 
        className="inline-flex items-center text-[--muted] hover:text-[--foreground] transition-colors duration-200"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Back to Matches
      </Link>
      {isAuthenticated && (
        <button
          onClick={onEdit}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-[--foreground] bg-[--input-bg] hover:bg-[--hover-bg] focus:outline-none focus:ring-2 focus:ring-[--primary] transition-colors"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
          Edit Match
        </button>
      )}
    </div>
  );
} 