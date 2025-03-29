import Link from 'next/link';

interface EditMatchHeaderProps {
  matchId: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditMatchHeader({ matchId, isSubmitting, onSubmit }: EditMatchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[--foreground]">Edit Match</h1>
      <div className="space-x-4">
        <Link 
          href={`/matches/${matchId}`} 
          className="button-secondary inline-flex items-center px-3 py-2 border rounded-lg transition-all duration-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="inline-flex items-center"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 