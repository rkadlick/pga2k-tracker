import { useState } from 'react';

export interface HoleData {
  hole_number: number;
  par: number | null;
  distance: number | null;
}

export function useCourseForm() {
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

  // Split holes into front nine and back nine for better mobile display
  const frontNine = holes.slice(0, 9);
  const backNine = holes.slice(9, 18);
  
  // Calculate totals
  const frontNinePar = frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const backNinePar = backNine.reduce((sum, hole) => sum + (hole.par || 0), 0);
  const totalPar = frontNinePar + backNinePar;
  
  const frontNineDistance = frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const backNineDistance = backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0);
  const totalDistance = frontNineDistance + backNineDistance;

  const updateHolePar = (rowId: string, colIndex: number, value: string) => {
    const actualIndex = rowId === 'frontPar' ? colIndex : colIndex + 9;
    const newHoles = [...holes];
    const numValue = value === '' ? null : Number(value);
    
    newHoles[actualIndex] = {
      ...newHoles[actualIndex],
      par: numValue
    };
    
    setHoles(newHoles);
    
    // Clear error for this hole if it exists
    if (errors.holes[actualIndex]) {
      const newErrors = { ...errors };
      newErrors.holes[actualIndex] = '';
      setErrors(newErrors);
    }
  };
  
  const updateHoleDistance = (rowId: string, colIndex: number, value: string) => {
    const actualIndex = rowId === 'frontDistance' ? colIndex : colIndex + 9;
    const newHoles = [...holes];
    const numValue = value === '' ? null : Number(value);
    
    newHoles[actualIndex] = {
      ...newHoles[actualIndex],
      distance: numValue
    };
    
    setHoles(newHoles);
    
    // Clear error for this hole if it exists
    if (errors.holes[actualIndex]) {
      const newErrors = { ...errors };
      newErrors.holes[actualIndex] = '';
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

  return {
    courseName,
    setCourseName,
    holes,
    frontNine,
    backNine,
    frontNinePar,
    backNinePar,
    totalPar,
    frontNineDistance,
    backNineDistance,
    totalDistance,
    errors,
    setErrors,
    updateHolePar,
    updateHoleDistance,
    validateForm
  };
} 