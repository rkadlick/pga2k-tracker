'use client';

import { useState, useEffect } from 'react';
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
  const { getMatchById, isLoading, error } = useMatches();
  const [match, setMatch] = useState<Match | null>(null);
  const { getCourseById} = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      if (matchId) {
        const fetchedMatch = await getMatchById(matchId);
        if (fetchedMatch) {
          setMatch(fetchedMatch);
        }
      }
    };

    fetchMatch();
  }, [matchId, getMatchById]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (match?.course_id) {
        setIsLoadingCourse(true);
        const fetchedCourse = await getCourseById(match?.course_id);
        setCourse(fetchedCourse);
        setIsLoadingCourse(false);
        }
      }

    fetchCourseData();
  }, [getCourseById, match?.course_id]);

  if (isLoadingCourse || isLoading || !match) {
    return <LoadingState message="Loading match details..." />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4">
        <MatchHeader 
          matchId={match.id} 
          onEdit={() => router.push(`/matches/${match.id}/edit`)}
          isAuthenticated={isAuthenticated}
        />
        <h1 className="text-3xl font-semibold text-[--foreground]">Match Details</h1>
      </div>

      <div className="card">
        <MatchOverview match={match} />
      </div>

      {course && (
        <div className="card">
          <MatchScorecardSection match={match} course={course} />
        </div>
      )}

      <div className="card">
        <MatchDetails match={match} />
      </div>
    </div>
  );
}
