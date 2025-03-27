import { useState } from 'react';

export interface HoleResultData {
  hole_number: number;
  result: 'win' | 'loss' | 'tie' | null;
}

export interface MatchFormData {
  date_played: string;
  course_id: string | null;
  nine_played: 'front' | 'back' | 'all';
  opponent_team_id: string | null;
  hole_results: HoleResultData[];
  rating_change: number;
  playoffs: boolean;
  notes: string;
  tags: string[];
}

export function useMatchForm() {
  const [formData, setFormData] = useState<MatchFormData>({
    date_played: new Date().toISOString().split('T')[0],
    course_id: null,
    nine_played: 'front',
    opponent_team_id: null,
    hole_results: Array.from({ length: 18 }, (_, i) => ({
      hole_number: i + 1,
      result: null
    })),
    rating_change: 0,
    playoffs: false,
    notes: '',
    tags: []
  });

  const updateFormData = <K extends keyof MatchFormData>(
    field: K,
    value: MatchFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setCourse = (courseId: string | null) => {
    setFormData(prev => ({ ...prev, course_id: courseId }));
  };

  const setOpponentTeam = (teamId: string) => {
    setFormData(prev => ({ ...prev, opponent_team_id: teamId }));
  };

  const updateHoleResult = (holeNumber: number, result: 'win' | 'loss' | 'tie' | null) => {
    setFormData(prev => ({
      ...prev,
      hole_results: prev.hole_results.map(hr =>
        hr.hole_number === holeNumber ? { ...hr, result } : hr
      )
    }));
  };

  const resetForm = () => {
    setFormData({
      date_played: new Date().toISOString().split('T')[0],
      course_id: null,
      nine_played: 'front',
      opponent_team_id: null,
      hole_results: Array.from({ length: 18 }, (_, i) => ({
        hole_number: i + 1,
        result: null
      })),
      rating_change: 0,
      playoffs: false,
      notes: '',
      tags: []
    });
  };

  return {
    formData,
    updateFormData,
    setCourse,
    setOpponentTeam,
    updateHoleResult,
    resetForm
  };
} 