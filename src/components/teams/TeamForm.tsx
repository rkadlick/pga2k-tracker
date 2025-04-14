interface TeamFormProps {
  onSubmit: (name: string, players: {id: string,  name: string; rating: number }[]) => void;
  onCancel: () => void;
}

export default function TeamForm({ onSubmit, onCancel }: TeamFormProps) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-[--foreground] mb-6">Add New Team</h2>
      <p className="text-[--muted] mb-4">Team form coming soon...</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg
                   bg-[--background]/50 text-[--muted] hover:text-[--foreground]
                   hover:bg-[--background]/75 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit("", [])}
          disabled
          className="px-4 py-2 text-sm font-medium rounded-lg
                   bg-[--primary] text-white
                   hover:bg-[--primary-hover] transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Team
        </button>
      </div>
    </div>
  );
} 