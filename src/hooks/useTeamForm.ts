import { useState } from 'react';

export interface TeamMemberForm {
  id: string;
  name: string;
  rank: number;
}

export interface TeamFormData {
  name: string;
  members: TeamMemberForm[];
}

export function useTeamForm() {
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    members: [
      { id: '', name: '', rank: 1500 },
      { id: '', name: '', rank: 1500 }
    ]
  });

  const updateMemberField = (index: number, field: keyof TeamMemberForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const updateTeamName = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      members: [
        { id: '', name: '', rank: 1500 },
        { id: '', name: '', rank: 1500 }
      ]
    });
  };

  const isValid = formData.members.every(member => 
    member.name.trim() !== '' && member.rank > 0
  ) && formData.name.trim() !== '';

  return {
    formData,
    updateMemberField,
    updateTeamName,
    resetForm,
    isValid
  };
} 