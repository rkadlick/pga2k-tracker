import { FormOptions } from '@/types';
import { useState, useCallback } from 'react';

export function useForm<T>({
  initialValues,
  validators = {},
  onSubmit
}: FormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update a single field value
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Validate field if validator exists
    if (validators[field]) {
      const error = validators[field]!(value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  }, [errors, validators]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Check each field with a validator
    Object.keys(validators).forEach(field => {
      const key = field as keyof T;
      const validator = validators[key];
      if (validator) {
        const error = validator(values[key]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors as Record<keyof T, string>);
    return isValid;
  }, [values, validators]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setIsSubmitting(true);
    
    const isValid = validateAll();
    
    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
    return isValid;
  }, [validateAll, values, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setValues,
    validateAll,
    handleSubmit,
    resetForm
  };
} 