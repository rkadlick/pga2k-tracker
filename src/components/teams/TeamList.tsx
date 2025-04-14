import { useState } from 'react';
import Link from 'next/link';
import { Team } from '@/types';

interface TeamListProps {
  teams: Team[];
  onDelete: (id: string) => void;
  isAuthenticated: boolean;
}

export default function TeamList({ teams, onDelete, isAuthenticated }: TeamListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filter out test team
  const filteredTeams = teams.filter(team => team.name !== "Fairway Fantatics Forever");

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setConfirmDelete(null);
  };

  if (filteredTeams.length === 0) {
    return (
      <div className="text-center p-8 card animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 text-[--muted]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-[--muted] mb-4">No teams added yet.</p>
        {isAuthenticated && (
          <button
            onClick={() => {}} // This will be handled by the parent component
            className="inline-flex items-center space-x-2 bg-[--primary] text-[--primary-foreground]
                     hover:bg-[--primary-hover] transition-colors px-4 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Your First Team</span>
          </button>
        )}
      </div>
    );
  }
  return (
    <ul className="space-y-4">
      {filteredTeams.map((team) => (
        <li key={team.id} className="animate-fade-in">
          <div className="card hover:bg-[--primary]/5">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Team Icon */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg
                                bg-[--primary]/10 text-[--primary]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  <div>
                    {/* Team Name */}
                    <Link
                      href={`/teams/${team.id}`}
                      className="text-[--foreground] hover:text-[--primary] font-medium transition-colors"
                    >
                      {team.name === "Fairway Fantatics Forever" ? "Hidden Test Team" : team.name}
                    </Link>
                    
                    {/* "Your Team" Badge */}
                    {team.is_your_team && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400">
                        Your Team
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <>
                      <Link
                        href={`/teams/${team.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                 bg-[--primary]/10 text-[--primary] hover:bg-[--primary]/20
                                 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>

                      {confirmDelete === team.id ? (
                        <>
                          <button
                            onClick={() => handleConfirmDelete(team.id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                     bg-rose-500/10 text-rose-600 dark:text-rose-400
                                     hover:bg-rose-500/20 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                     bg-[--primary]/5 text-[--muted] hover:text-[--foreground]
                                     hover:bg-[--primary]/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(team.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                   bg-rose-500/10 text-rose-600 dark:text-rose-400
                                   hover:bg-rose-500/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Players List */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.players?.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg
                             bg-[--background]/50 hover:bg-[--background]/75
                             transition-colors"
                  >
                    <span className="text-sm font-medium text-[--foreground]">
                      {player.name}
                    </span>
                    <span className="text-sm font-medium text-[--muted]">
                      Rating: {player.recent_rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 