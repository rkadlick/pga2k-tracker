import Link from 'next/link';
import { Team } from '@/types';
import TeamItem from './TeamItem';

interface TeamListProps {
  teams: Team[];
  isAuthenticated: boolean;
}

export default function TeamList({ teams, isAuthenticated}: TeamListProps) {
  // Filter out test team
  const filteredTeams = teams.filter(team => team.name !== "Fairway Fantatics Forever");

  if (filteredTeams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-[--muted]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-[--muted] mb-4">No teams found.</p>
        {isAuthenticated && (
          <Link
            href="/teams/new"
            className="inline-flex items-center space-x-2 bg-[--primary] text-[--primary-foreground]
                     hover:bg-[--primary-hover] transition-colors px-6 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Your First Team</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredTeams.map((team, index) => (
        <div key={team.id} className="animate-fade-in">
          <TeamItem
            team={team}
            isAuthenticated={isAuthenticated}
            index={index}
          />
        </div>
      ))}
    </div>
  );
} 