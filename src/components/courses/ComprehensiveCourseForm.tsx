import { useState } from 'react';

interface HoleData {
  hole_number: number;
  par: number | null;
  distance: number | null;
}

interface ComprehensiveCourseFormProps {
  onSubmit: (courseName: string, holes: Omit<HoleData, 'id' | 'created_at'>[]) => void;
  onCancel: () => void;
}

export default function ComprehensiveCourseForm({ 
  onSubmit, 
  onCancel 
}: ComprehensiveCourseFormProps) {
  const [courseName, setCourseName] = useState('');
  const [holes, setHoles] = useState<HoleData[]>(
    Array.from({ length: 18 }, (_, i) => ({
      hole_number: i + 1,
      par: null,
      distance: null
    }))
  );
  const [errors, setErrors] = useState({
    courseName: '',
    holes: Array(18).fill('')
  });

  const updateHole = (index: number, field: keyof Omit<HoleData, 'hole_number'>, value: string) => {
    const newHoles = [...holes];
    const numValue = value === '' ? null : Number(value);
    
    newHoles[index] = {
      ...newHoles[index],
      [field]: numValue
    };
    
    setHoles(newHoles);
    
    // Clear error for this hole if it exists
    if (errors.holes[index]) {
      const newErrors = { ...errors };
      newErrors.holes[index] = '';
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      courseName: '',
      holes: Array(18).fill('')
    };
    
    let isValid = true;
    
    // Validate course name
    if (!courseName.trim()) {
      newErrors.courseName = 'Course name is required';
      isValid = false;
    }
    
    // Validate holes
    holes.forEach((hole, index) => {
      if (hole.par === null) {
        newErrors.holes[index] = 'Par is required';
        isValid = false;
      } else if (hole.par < 2 || hole.par > 6) {
        newErrors.holes[index] = 'Par must be between 2 and 6';
        isValid = false;
      }
      
      if (hole.distance === null) {
        newErrors.holes[index] = newErrors.holes[index] || 'Distance is required';
        isValid = false;
      } else if (hole.distance <= 0) {
        newErrors.holes[index] = newErrors.holes[index] || 'Distance must be positive';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(courseName, holes);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
          Course Name
        </label>
        <input
          type="text"
          id="courseName"
          value={courseName}
          onChange={(e) => {
            setCourseName(e.target.value);
            if (errors.courseName) {
              setErrors({...errors, courseName: ''});
            }
          }}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.courseName ? 'border-red-300' : ''
          }`}
          placeholder="Augusta National"
        />
        {errors.courseName && (
          <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Hole Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {holes.map((hole, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                errors.holes[index] ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="font-medium mb-2">Hole {hole.hole_number}</div>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor={`hole-${index}-par`} className="block text-sm text-gray-700">
                    Par (2-6)
                  </label>
                  <input
                    id={`hole-${index}-par`}
                    type="number"
                    min={2}
                    max={6}
                    value={hole.par === null ? '' : hole.par}
                    onChange={(e) => updateHole(index, 'par', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor={`hole-${index}-distance`} className="block text-sm text-gray-700">
                    Distance (yards)
                  </label>
                  <input
                    id={`hole-${index}-distance`}
                    type="number"
                    min={1}
                    value={hole.distance === null ? '' : hole.distance}
                    onChange={(e) => updateHole(index, 'distance', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {errors.holes[index] && (
                <p className="mt-2 text-sm text-red-600">{errors.holes[index]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Course
        </button>
      </div>
    </form>
  );
}
