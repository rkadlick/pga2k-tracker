import React from 'react';
import { MatchFormData } from '../../../hooks/useMatchForm';

interface MatchDetailsProps {
  ratingChange: number;
  playoffs: boolean;
  notes: string;
  tags: string[];
  onInputChange: <K extends keyof MatchFormData>(field: K, value: MatchFormData[K]) => void;
}

export default function MatchDetails({
  ratingChange,
  playoffs,
  notes,
  tags,
  onInputChange
}: MatchDetailsProps) {
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onInputChange('tags', newTags);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Match Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating Change
            <input
              type="number"
              value={ratingChange}
              onChange={(e) => onInputChange('rating_change', parseInt(e.target.value, 10) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={playoffs}
              onChange={(e) => onInputChange('playoffs', e.target.checked)}
              className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Playoffs
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
          <textarea
            value={notes}
            onChange={(e) => onInputChange('notes', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
          <input
            type="text"
            value={tags.join(', ')}
            onChange={handleTagsChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </label>
      </div>
    </div>
  );
} 