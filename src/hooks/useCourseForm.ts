import { useState, useCallback, useMemo } from 'react';
import { useForm, FieldValidators } from './useForm';
import { 
  validateCourseName, 
  validateHolePar, 
  validateHoleDistance 
} from '@/lib/validation/courseValidation';

export interface HoleData {
  hole_number: number;
  par: number | null;
  distance: number | null;
}

interface CourseFormValues {
  courseName: string;
  holes: HoleData[];
}

// Validation rules for course form using shared validation
const courseValidators: FieldValidators<CourseFormValues> = {
  courseName: (value) => validateCourseName(value)
};

export function useCourseForm(onSubmit?: (courseName: string, holes: HoleData[], frontPar: number, backPar: number, totalPar: number, frontDistance: number, backDistance: number, totalDistance: number) => void) {
  // Initialize with empty course name and 18 holes
  const initialValues: CourseFormValues = {
    courseName: '',
    holes: Array.from({ length: 18 }, (_, i) => ({
      hole_number: i + 1,
      par: null,
      distance: null
    }))
  };

  // Use the generic form hook
  const form = useForm<CourseFormValues>({
    initialValues,
    validators: courseValidators
  });

  // Additional state for hole-specific errors
  const [holeErrors, setHoleErrors] = useState<string[]>(Array(18).fill(''));

  // Split holes into front nine and back nine
  const frontNine = useMemo(() => form.values.holes.slice(0, 9), [form.values.holes]);
  const backNine = useMemo(() => form.values.holes.slice(9, 18), [form.values.holes]);

  // Calculate totals
  const frontNinePar = useMemo(() => 
    frontNine.reduce((sum, hole) => sum + (hole.par || 0), 0), 
    [frontNine]
  );
  
  const backNinePar = useMemo(() => 
    backNine.reduce((sum, hole) => sum + (hole.par || 0), 0), 
    [backNine]
  );
  
  const totalPar = useMemo(() => 
    frontNinePar + backNinePar, 
    [frontNinePar, backNinePar]
  );
  
  const frontNineDistance = useMemo(() => 
    frontNine.reduce((sum, hole) => sum + (hole.distance || 0), 0), 
    [frontNine]
  );
  
  const backNineDistance = useMemo(() => 
    backNine.reduce((sum, hole) => sum + (hole.distance || 0), 0), 
    [backNine]
  );
  
  const totalDistance = useMemo(() => 
    frontNineDistance + backNineDistance, 
    [frontNineDistance, backNineDistance]
  );

  // Update hole par
  const updateHolePar = useCallback((rowId: string, colIndex: number, value: string) => {
    const actualIndex = rowId === 'frontPar' ? colIndex : colIndex + 9;
    const newHoles = [...form.values.holes];
    const numValue = value === '' ? null : Number(value);
    
    newHoles[actualIndex] = {
      ...newHoles[actualIndex],
      par: numValue
    };
    
    form.setValues({
      ...form.values,
      holes: newHoles
    });
    
    // Validate and update error
    const error = validateHolePar(numValue);
    if (error) {
      const newErrors = [...holeErrors];
      newErrors[actualIndex] = error;
      setHoleErrors(newErrors);
    } else if (holeErrors[actualIndex]) {
      // Clear error if it exists
      const newErrors = [...holeErrors];
      newErrors[actualIndex] = '';
      setHoleErrors(newErrors);
    }
  }, [form, holeErrors]);
  
  // Update hole distance
  const updateHoleDistance = useCallback((rowId: string, colIndex: number, value: string) => {
    const actualIndex = rowId === 'frontDistance' ? colIndex : colIndex + 9;
    const newHoles = [...form.values.holes];
    const numValue = value === '' ? null : Number(value);
    
    newHoles[actualIndex] = {
      ...newHoles[actualIndex],
      distance: numValue
    };
    
    form.setValues({
      ...form.values,
      holes: newHoles
    });
    
    // Validate and update error
    const error = validateHoleDistance(numValue);
    if (error) {
      const newErrors = [...holeErrors];
      newErrors[actualIndex] = error;
      setHoleErrors(newErrors);
    } else if (holeErrors[actualIndex]) {
      // Clear error if it exists
      const newErrors = [...holeErrors];
      newErrors[actualIndex] = '';
      setHoleErrors(newErrors);
    }
  }, [form, holeErrors]);

  // Validate all holes
  const validateHoles = useCallback(() => {
    const newErrors = Array(18).fill('');
    let isValid = true;
    
    form.values.holes.forEach((hole, index) => {
      const parError = validateHolePar(hole.par);
      if (parError) {
        newErrors[index] = parError;
        isValid = false;
      }
      
      const distanceError = validateHoleDistance(hole.distance);
      if (distanceError && !newErrors[index]) {
        newErrors[index] = distanceError;
        isValid = false;
      }
    });
    
    setHoleErrors(newErrors);
    return isValid;
  }, [form.values.holes]);

  // Custom submit handler that validates holes
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const isFormValid = await form.handleSubmit();
    const areHolesValid = validateHoles();
    
    if (isFormValid && areHolesValid && onSubmit) {
      onSubmit(
        form.values.courseName,
        form.values.holes,
        frontNinePar,
        backNinePar,
        totalPar,
        frontNineDistance,
        backNineDistance,
        totalDistance
      );
      return true;
    }
    
    return false;
  }, [form, validateHoles, onSubmit, frontNinePar, backNinePar, totalPar, frontNineDistance, backNineDistance, totalDistance]);

  return {
    courseName: form.values.courseName,
    setCourseName: (value: string) => form.setValue('courseName', value),
    holes: form.values.holes,
    frontNine,
    backNine,
    frontNinePar,
    backNinePar,
    totalPar,
    frontNineDistance,
    backNineDistance,
    totalDistance,
    errors: {
      courseName: form.errors.courseName || '',
      holes: holeErrors
    },
    updateHolePar,
    updateHoleDistance,
    validateForm: validateHoles,
    handleSubmit,
    isSubmitting: form.isSubmitting,
    resetForm: form.resetForm
  };
} 