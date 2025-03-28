'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { Course, Match } from '@/types';
import { useCourses} from '@/hooks/useCourses';
import MatchHeader from '@/components/matches/matchDetails/MatchHeader';
import MatchOverview from '@/components/matches/matchDetails/MatchOverview';
import MatchScorecardSection from '@/components/matches/matchDetails/MatchScorecardSection';
import MatchDetails from '@/components/matches/matchDetails/MatchDetails';


export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { matches, isLoading: isLoadingMatches, error: errorMatches } = useMatches();
  const [match, setMatch] = useState<Match | null>(null);
  const { getCourseWithHoles, isLoading: isLoadingCourses, error: errorCourses } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      if (matchId) {
        const fetchedMatch = matches.find(m => m.id === matchId);
        if (fetchedMatch) {
          console.log('fetchedMatch', fetchedMatch);
          setMatch(fetchedMatch);
        }
      }
    };

    fetchMatch();
  }, [matchId, matches]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (match?.course_id) {
        setIsLoadingCourse(true);
        const fetchedCourse = await getCourseWithHoles(match?.course_id);
        setCourse(fetchedCourse);
        setIsLoadingCourse(false);
        }
      }

    fetchCourseData();
  }, [match?.course_id]);

  if (isLoadingMatches || !match || isLoadingCourses) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-600">Loading match details...</p>
      </div>
    );
  }

  if (errorMatches || errorCourses) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{errorMatches?.message || errorCourses?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MatchHeader 
        matchId={match.id} 
        onEdit={() => router.push(`/matches/${match.id}/edit`)} 
      />
      <MatchOverview match={match} />
      {course && (
        <MatchScorecardSection match={match} course={course} />
      )}
      <MatchDetails match={match} />
    </div>
  );
}
