'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { useAuth } from '@/hooks/useAuth';
import { Course, Match } from '@/types';
import { useCourses} from '@/hooks/useCourses';
import MatchHeader from '@/components/matches/MatchDetails/MatchHeader';
import MatchOverview from '@/components/matches/MatchDetails/MatchOverview';
import MatchScorecardSection from '@/components/matches/MatchDetails/MatchScorecardSection';
import MatchDetails from '@/components/matches/MatchDetails/MatchDetails';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getMatchById, isLoading: isLoadingMatch, error } = useMatches();
  const [match, setMatch] = useState<Match | null>(null);
  const { getCourseById } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetCourseById = useCallback(getCourseById, []);

  // Single ref to track all fetch states
  const fetchStateRef = useRef({
    matchFetched: false,
    courseFetched: false,
    courseId: null as string | null
  });

  // First effect just for match fetching
  useEffect(() => {
    let isMounted = true;

    const fetchMatch = async () => {
      if (!matchId || fetchStateRef.current.matchFetched) return;

      try {
        const fetchedMatch = await getMatchById(matchId);
        if (isMounted && fetchedMatch) {
          setMatch(fetchedMatch);
          fetchStateRef.current.matchFetched = true;
        }
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };

    fetchMatch();

    return () => {
      isMounted = false;
    };
  }, [matchId, getMatchById]);

  // Separate effect for course fetching
  useEffect(() => {
    if (!match?.course_id) return;
    if (fetchStateRef.current.courseId === match.course_id) return;

    let isMounted = true;

    const fetchCourse = async () => {
      try {
        setIsLoadingCourse(true);
        const fetchedCourse = await memoizedGetCourseById(match.course_id);
        
        if (isMounted) {
          setCourse(fetchedCourse);
          fetchStateRef.current.courseId = match.course_id;
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        if (isMounted) {
          setIsLoadingCourse(false);
        }
      }
    };

    fetchCourse();

    return () => {
      isMounted = false;
    };
  }, [match?.course_id, memoizedGetCourseById]);

  // Combined loading state
  const isLoading = isLoadingMatch || isLoadingCourse || !match;
  
  if (isLoading) {
    return <LoadingState message="Loading match details..." />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <MatchHeader 
          matchId={match.id} 
          onEdit={() => router.push(`/matches/${match.id}/edit`)}
          isAuthenticated={isAuthenticated}
        />
        <h1 className="text-3xl font-semibold text-[--foreground] font-primary">Match Details</h1>
      </div>

      {/* Overview Card */}
      <div className="card p-6">
        <MatchOverview match={match} />
      </div>

      {/* Scorecard Card */}
      {course && (
        <div className="card p-6">
          <MatchScorecardSection match={match} course={course} />
        </div>
      )}

      {/* Details Card */}
      {match.notes && (
        <div className="card p-6">
          <MatchDetails match={match} />
        </div>
      )}
    </div>
  );
}
