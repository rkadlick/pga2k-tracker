import { useState } from 'react';
import { Hole } from '@/types';

interface HoleFormProps {
  courseId: string;
  initialData?: Partial<Hole>;
  onSubmit: (holeData: Pick<Hole, 'course_id' | 'hole_number' | 'par' | 'distance'>) => void;
  onCancel: () => void;
}

export default function HoleForm({
  courseId,
  initialData,
  onSubmit,
  onCancel
}: HoleFormProps) {
  const [holeNumber, setHoleNumber] = useState(initialData?.hole_number || 1);
  const [par, setPar] = useState(initialData?.par || 4);
  const [distance, setDistance] = useState(initialData?.distance || undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (holeNumber < 1 || holeNumber > 18) {
      newErrors.holeNumber = 'Hole number must be between 1 and 18';
    }
    
    if (par < 3 || par > 5) {
      newErrors.par = 'Par must be between 3 and 5';
    }
    
    if (distance !== undefined && (distance < 100 || distance > 700)) {
      newErrors.distance = 'Distance must be between 100 and 700 yards';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      course_id: courseId,
      hole_number: holeNumber,
      par,
      distance
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="holeNumber" className="block text-sm font-medium text-[--foreground]">
            Hole Number
          </label>
          <input
            type="number"
            id="holeNumber"
            value={holeNumber}
            onChange={(e) => setHoleNumber(parseInt(e.target.value))}
            min={1}
            max={18}
            className={`mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm ${
              errors.holeNumber ? 'border-red-500 dark:border-red-400' : ''
            }`}
          />
          {errors.holeNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.holeNumber}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="par" className="block text-sm font-medium text-[--foreground]">
            Par
          </label>
          <select
            id="par"
            value={par}
            onChange={(e) => setPar(parseInt(e.target.value))}
            className={`mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm ${
              errors.par ? 'border-red-500 dark:border-red-400' : ''
            }`}
          >
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          {errors.par && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.par}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-[--foreground]">
            Distance (yards)
          </label>
          <input
            type="number"
            id="distance"
            value={distance || ''}
            onChange={(e) => setDistance(e.target.value ? parseInt(e.target.value) : undefined)}
            min={100}
            max={700}
            className={`mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm ${
              errors.distance ? 'border-red-500 dark:border-red-400' : ''
            }`}
          />
          {errors.distance && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.distance}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[--border] rounded-lg text-sm font-medium text-[--foreground] bg-[--input-bg] hover:bg-[--hover-bg] focus:outline-none focus:ring-2 focus:ring-[--primary]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary]"
        >
          Save
        </button>
      </div>
    </form>
  );
}
