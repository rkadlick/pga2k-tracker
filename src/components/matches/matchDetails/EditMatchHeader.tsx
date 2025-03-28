import Link from 'next/link';

interface EditMatchHeaderProps {
  matchId: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditMatchHeader({ matchId, isSubmitting, onSubmit }: EditMatchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Edit Match</h1>
      <div className="space-x-4">
        <Link href={`/matches/${matchId}`} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 