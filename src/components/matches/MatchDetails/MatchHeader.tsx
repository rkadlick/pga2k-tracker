import Link from 'next/link';

interface MatchHeaderProps {
  matchId: string;
  onEdit: () => void;
  isAuthenticated: boolean;
}

export default function MatchHeader({ onEdit, isAuthenticated }: MatchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Link 
        href="/matches" 
        className="breadcrumb"
      >
        <svg 
          className="breadcrumb-icon" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        <span className="breadcrumb-text">Back to Matches</span>
      </Link>
      {isAuthenticated && (
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2"
        >
          <svg 
            className="w-4 h-4" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" 
            />
            <path 
              d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" 
            />
          </svg>
          Edit Match
        </button>
      )}
    </div>
  );
} 