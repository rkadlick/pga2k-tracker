import React from 'react';

interface MatchDetailsProps {
  ratingChange: number | null;
  playoffs: boolean;
  notes: string;
  tags: string[];
  onInputChange: (field: string, value: string | number | boolean | string[]) => void;
}

export default function MatchDetails({ 
  ratingChange, 
  playoffs, 
  notes, 
  tags, 
  onInputChange 
}: MatchDetailsProps) {
  // Local state for tags input
  const [tagsInput, setTagsInput] = React.useState(tags.join(', '));

  // Update tags when input changes
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Split by commas and trim
    const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onInputChange('tags', newTags);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Match Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Match Details</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="rating_change" className="block text-sm font-medium text-gray-700">
              Rating Change
            </label>
            <input
              type="number"
              id="rating_change"
              value={ratingChange || ''}
              onChange={(e) => onInputChange('rating_change', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="playoffs"
              checked={playoffs}
              onChange={(e) => onInputChange('playoffs', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="playoffs" className="ml-2 block text-sm text-gray-700">
              Playoff Match
            </label>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>
      
      {/* Additional Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (optional, comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g. important, comeback, birdie"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 