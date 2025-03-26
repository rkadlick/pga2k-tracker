import React, { ReactNode } from 'react';
import Scorecard from '@/components/common/Scorecard';
import { HoleResult } from '@/types';

interface Hole {
  par: number;
  distance: number;
  hole_number: number;
}

interface MatchScorecardProps {
  courseData: { name: string } | null;
  visibleHoles: Hole[];
  formData: {
    hole_results: Array<{ result: HoleResult }>;
    your_team_score: number;
    opponent_team_score: number;
  };
  yourTeamName: string;
  opponentTeamName: string;
  renderHoleResultCell: (value: string | number | null, index: number, rowType: 'your_team' | 'tie' | 'opponent_team') => ReactNode;
  columns: Array<{ label: string }>;
}

export default function MatchScorecard({
  courseData,
  visibleHoles,
  formData,
  yourTeamName,
  opponentTeamName,
  renderHoleResultCell,
  columns
}: MatchScorecardProps) {
  const rows = [
    {
      id: 'par',
      type: 'par' as const,
      label: 'Par',
      values: courseData ? visibleHoles.map(hole => hole.par) : Array(9).fill(''),
      total: courseData ? visibleHoles.reduce((sum, hole) => sum + hole.par, 0) : ''
    },
    {
      id: 'distance',
      type: 'distance' as const,
      label: 'Yards',
      values: courseData ? visibleHoles.map(hole => hole.distance) : Array(9).fill(''),
      total: courseData ? visibleHoles.reduce((sum, hole) => sum + hole.distance, 0) : ''
    },
    {
      id: 'your_team',
      type: 'match' as const,
      label: yourTeamName || 'Your Team',
      values: formData.hole_results.map(hr => hr.result as string | null),
      renderCell: (value: string | number | null, index: number) => renderHoleResultCell(value, index, 'your_team'),
      total: ''
    },
    {
      id: 'tie',
      type: 'match' as const,
      label: 'Tie',
      values: formData.hole_results.map(hr => hr.result as string | null),
      renderCell: (value: string | number | null, index: number) => renderHoleResultCell(value, index, 'tie'),
      total: `${formData.your_team_score / 2} - ${formData.opponent_team_score / 2}`
    },
    {
      id: 'opponent_team',
      type: 'match' as const,
      label: opponentTeamName || 'Opponent Team',
      values: formData.hole_results.map(hr => hr.result as string | null),
      renderCell: (value: string | number | null, index: number) => renderHoleResultCell(value, index, 'opponent_team'),
      total: ''
    }
  ];

  return <Scorecard columns={columns} rows={rows} />;
} 