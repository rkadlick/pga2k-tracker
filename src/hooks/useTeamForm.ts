import { useState } from 'react';
import { TeamMember } from '@/lib/api/teamClient';

export type TeamFormData = {
  name: string;
  members: TeamMember[];
  is_your_team: boolean;
};

export function useTeamForm(onSubmit: (data: TeamFormData) => Promise<void>) {
  // State for form data
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    members: [
      { name: '', rank: 0 },
      { name: '', rank: 0 }
    ],
    is_your_team: false
  });
  
  // State for form submission and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    general: string;
    fields: Record<string, string>;
  }>({
    general: '',
    fields: {}
  });

  // Handle input changes
  const handleInputChange = (field: keyof TeamFormData | `members.${number}.${keyof TeamMember}`, value: string | number | boolean) => {
    setFormData(prev => {
      if (field.startsWith('members.')) {
        const [, indexStr, memberField] = field.split('.');
        const index = parseInt(indexStr);
        const newMembers = [...prev.members];
        newMembers[index] = {
          ...newMembers[index],
          [memberField]: value
        };
        return {
          ...prev,
          members: newMembers
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Clear field error if it exists
    if (errors.fields[field]) {
      setErrors(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [field]: ''
        }
      }));
    }
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name) newErrors.name = 'Team name is required';
    
    // Validate members
    formData.members.forEach((member, index) => {
      if (!member.name) {
        newErrors[`members.${index}.name`] = 'Member name is required';
      }
      if (member.rank < 0) {
        newErrors[`members.${index}.rank`] = 'Rank must be a non-negative number';
      }
    });
    
    setErrors(prev => ({
      ...prev,
      fields: newErrors
    }));
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrors(prev => ({
        ...prev,
        general: 'Failed to submit form. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    errors,
    handleInputChange,
    handleSubmit
  };
} 