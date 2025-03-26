import { useState, useEffect } from 'react';
import { NinePlayed, HoleResult } from '@/types';

export interface HoleResultData {
  hole_number: number;
  result: HoleResult | null;
}

export type MatchFormData = {
  date_played: string;
  course_id: string;
  your_team_id: string;
  opponent_team_id: string;
  nine_played: NinePlayed;
  your_team_score: number;
  opponent_team_score: number;
  winner_id: string | null;
  rating_change: number ;
  margin: number;
  playoffs: boolean;
  notes: string;
  tags: string[];
  hole_results: HoleResultData[];
};

export function useMatchForm(onSubmit: (data: MatchFormData) => Promise<void>) {
  // State for form data
  const [formData, setFormData] = useState<MatchFormData>({
    date_played: new Date().toISOString().split('T')[0],
    course_id: '',
    your_team_id: '',
    opponent_team_id: '',
    nine_played: 'front' as NinePlayed,
    your_team_score: 0,
    opponent_team_score: 0,
    winner_id: null,
    rating_change: 0,
    margin: 0,
    playoffs: false,
    notes: '',
    tags: [],
    hole_results: []
  });

  // State for loading external data
  const [teams, setTeams] = useState<{ id: string; name: string; is_your_team: boolean; created_at: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [courseData, setCourseData] = useState<{
    holes: { hole_number: number; par: number; distance: number }[];
    name: string;
  } | null>(null);
  
  // State for form submission and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<{
    general: string;
    fields: Record<string, string>;
  }>({
    general: '',
    fields: {}
  });

  // Load teams and courses on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch teams
        const teamsResponse = await fetch('/api/teams');
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.data);
        
        // Fetch courses
        const coursesResponse = await fetch('/api/courses');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.data);
        
        // Set default values if data is available
        if (teamsData.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            your_team_id: teamsData.data[0].id
          }));
        }
        
        if (coursesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            course_id: coursesData[0].id
          }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setErrors(prev => ({
          ...prev,
          general: 'Failed to load initial data. Please try again.'
        }));
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  // Load course data when course_id changes
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!formData.course_id) {
        setCourseData(null);
        return;
      }
      
      try {
        const response = await fetch(`/api/courses/${formData.course_id}`);
        const data = await response.json();
        setCourseData(data.data);
        
        // Only initialize hole results if we have both course and nine_played
        if (formData.nine_played) {
          console.log('data', data);
          initializeHoleResults(data.data.holes, formData.nine_played);
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setErrors(prev => ({
          ...prev,
          general: 'Failed to load course data. Please try again.'
        }));
      }
    };
    
    fetchCourseData();
  }, [formData.course_id]);

  // Update hole results when nine_played changes
  useEffect(() => {
    if (courseData && formData.nine_played) {
      initializeHoleResults(courseData.holes, formData.nine_played);
    }
  }, [formData.nine_played]);

  // Initialize hole results based on nine_played
  const initializeHoleResults = (holes: { hole_number: number; par: number; distance: number }[], ninePlayed: NinePlayed) => {
    let relevantHoles: { hole_number: number; par: number; distance: number }[] = [];
    
    if (ninePlayed === 'front') {
      relevantHoles = holes.filter(hole => hole.hole_number <= 9);
    } else if (ninePlayed === 'back') {
      relevantHoles = holes.filter(hole => hole.hole_number > 9);
    } else {
      relevantHoles = holes;
    }
    
    const newHoleResults: HoleResultData[] = relevantHoles.map(hole => ({
      hole_number: hole.hole_number,
      result: null
    }));
    
    setFormData(prev => ({
      ...prev,
      hole_results: newHoleResults
    }));
  };

  // Helper function to calculate match results
  const calculateMatchResults = (holeResults: HoleResultData[], yourTeamId: string, opponentTeamId: string) => {
    const yourWins = holeResults.filter(hr => hr.result === 'win').length;
    const opponentWins = holeResults.filter(hr => hr.result === 'loss').length;
    const ties = holeResults.filter(hr => hr.result === 'tie').length;
    
    // Convert to integers by multiplying by 2 (1 point becomes 2, 0.5 becomes 1)
    const yourScore = (yourWins * 2) + ties;
    const opponentScore = (opponentWins * 2) + ties;
    
    let winnerId = null;
    if (yourScore > opponentScore) {
      winnerId = yourTeamId;
    } else if (opponentScore > yourScore) {
      winnerId = opponentTeamId;
    }
    
    return {
      yourTeamScore: yourScore,
      opponentTeamScore: opponentScore,
      winnerId,
      margin: Math.abs(yourScore - opponentScore) / 2 // Convert margin back to original scale
    };
  };

  // Update hole result
  const updateHoleResult = (holeNumber: number, result: HoleResult) => {
    setFormData(prev => {
      const newHoleResults = [...prev.hole_results];
      const index = newHoleResults.findIndex(hr => hr.hole_number === holeNumber);
      
      if (index !== -1) {
        newHoleResults[index] = {
          ...newHoleResults[index],
          result
        };
      }
      
      const results = calculateMatchResults(newHoleResults, prev.your_team_id, prev.opponent_team_id);
      
      return {
        ...prev,
        hole_results: newHoleResults,
        your_team_score: results.yourTeamScore,
        opponent_team_score: results.opponentTeamScore,
        winner_id: results.winnerId,
        margin: results.margin
      };
    });
  };

  // Handle input changes
  const handleInputChange = (field: keyof MatchFormData, value: string | number | boolean | string[] | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
    if (!formData.date_played) newErrors.date_played = 'Date is required';
    if (!formData.course_id) newErrors.course_id = 'Course is required';
    if (!formData.your_team_id) newErrors.your_team_id = 'Your team is required';
    if (!formData.opponent_team_id) newErrors.opponent_team_id = 'Opponent team is required';
    
    // Check if teams are the same
    if (formData.your_team_id === formData.opponent_team_id) {
      newErrors.opponent_team_id = 'Opponent team must be different from your team';
    }
    
    // Check if all holes have results
    const hasIncompleteHoles = formData.hole_results.some(hr => hr.result === null);
    if (hasIncompleteHoles) {
      newErrors.hole_results = 'Please enter a result for all holes';
    }
    
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
    
    // Recalculate match results before submission
    const results = calculateMatchResults(formData.hole_results, formData.your_team_id, formData.opponent_team_id);
    
    const finalFormData = {
      ...formData,
      your_team_score: results.yourTeamScore,
      opponent_team_score: results.opponentTeamScore,
      winner_id: results.winnerId,
      margin: results.margin
    };
    
    setIsSubmitting(true);
    try {
      await onSubmit(finalFormData);
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

  // Get filterable holes based on nine_played
  const getVisibleHoles = () => {
    if (!courseData) return [];
    
    if (formData.nine_played === 'front') {
      return courseData.holes.filter(hole => hole.hole_number <= 9);
    } else if (formData.nine_played === 'back') {
      return courseData.holes.filter(hole => hole.hole_number > 9);
    } else {
      return courseData.holes;
    }
  };

  return {
    formData,
    teams,
    courses,
    courseData,
    isSubmitting,
    isLoadingData,
    errors,
    visibleHoles: getVisibleHoles(),
    handleInputChange,
    updateHoleResult,
    handleSubmit,
    yourTeamName: teams.find(t => t.id === formData.your_team_id)?.name || '',
    opponentTeamName: teams.find(t => t.id === formData.opponent_team_id)?.name || ''
  };
} 