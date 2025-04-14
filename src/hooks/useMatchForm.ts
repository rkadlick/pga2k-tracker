import { useCallback, useState } from 'react';

export interface HoleResultData {
  hole_number: number;
  result: 'win' | 'loss' | 'tie' | null;
}

export interface MatchFormData {
  date_played: string;
  course_id: string | null;
  nine_played: 'front' | 'back';
  opponent_team_id: string | null;
  hole_results: HoleResultData[];
  rating_change: number;
  playoffs: boolean;
  notes: string;
  tags: string[];
  player1_id?: string;
  player1_rating?: number;
  player2_id?: string;
  player2_rating?: number;
  opponent1_id?: string;
  opponent1_rating?: number;
  opponent2_id?: string;
  opponent2_rating?: number;
  holes_won?: number;
  holes_tied?: number;
  holes_lost?: number;
  winner_id?: string | null;
}

export function useMatchForm() {
  const [formData, setFormData] = useState<MatchFormData>({
    date_played: new Date().toISOString().split('T')[0],
    course_id: null,
    nine_played: 'front',
    opponent_team_id: null,
    player1_id: undefined,
    player1_rating: undefined,
    player2_id: undefined,
    player2_rating: undefined,
    opponent1_id: undefined,
    opponent1_rating: undefined,
    opponent2_id: undefined,
    opponent2_rating: undefined,
    holes_won: undefined,
    holes_tied: undefined,
    holes_lost: undefined,
    winner_id: undefined,
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

  const setYourTeamPlayers = useCallback(
    (players: { id: string; recent_rating: number }[]) => {
      setFormData(prev => ({
        ...prev,
        player1_id: players[0].id,
        player1_rating: players[0].recent_rating,
        player2_id: players[1].id,
        player2_rating: players[1].recent_rating
      }));
    },
    [] // Empty dependency array since it only depends on setFormData, which is stable
  );
  
  const setOpponentTeamPlayers = (players: { id: string; recent_rating: number }[]) => {
    setFormData(prev => ({ ...prev, opponent1_id: players[0].id, opponent1_rating: players[0].recent_rating, opponent2_id: players[1].id, opponent2_rating: players[1].recent_rating }));
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
    setOpponentTeamPlayers,
    setYourTeamPlayers,
    updateHoleResult,
    resetForm
  };
} 