'use client';

import { useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import MatchForm from '@/components/matches/MatchForm';
import { MatchFormData } from '@/hooks/useMatchForm';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { HoleResult } from '@/types';
import { useCourses } from '@/hooks/useCourses';

export default function NewMatchPage() {
  const router = useRouter();
  const { createMatch, error: matchError } = useMatches();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  
  const handleSubmit = async (data: MatchFormData) => {
    try {
      // Transform the data to match what createMatch expects
      // Filter out any hole results with null values
      const validHoleResults = data.hole_results
        .filter(hr => hr.result !== null)
        .map(hr => ({
          hole_number: hr.hole_number,
          result: hr.result as HoleResult, // Safe to cast since we filtered nulls
          match_id: undefined // This will be set by the backend
        }));
      const matchData = {
        ...data,
        hole_results: validHoleResults,
        rating_change: data.rating_change ? Number(data.rating_change) : 0 // Convert to number
      };
      
      const newMatch = await createMatch(matchData);
      console.log('newMatch', newMatch);
      if (newMatch) {
        router.push(`/matches`);
      }
    } catch (err) {
      console.error('Error creating match:', err);
      throw err; // Let the form handle the error
    }
  };
  
  // Show loading state while checking authentication or loading courses
  if (authLoading || coursesLoading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You need to be signed in to add new matches.</p>
        <Link 
          href="/matches"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Matches
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/matches" className="text-blue-600 hover:text-blue-800">
          ← Back to Matches
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">New Match</h1>
      
      {(matchError || coursesError) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{matchError?.message || coursesError?.message}</p>
            </div>
          </div>
        </div>
      )}
      
      <MatchForm
        courses={courses || []}
        loading={coursesLoading}
        error={coursesError?.message || null}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 