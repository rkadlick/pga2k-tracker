"use client";

import { useState } from "react";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import TeamList from "@/components/teams/TeamList";
import TeamForm from "@/components/teams/TeamForm";

export default function TeamsPage() {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const { 
    teams, 
    isLoading, 
    error,
    createTeam,
    deleteTeam 
  } = useTeams();

  const handleAddTeam = async (name: string, players: { id: string, name: string; rating: number }[]) => {
    try {
      await createTeam({ name, players, playerIds: players.map(player => player.id), playerRatings: players.map(player => player.rating) });
      setIsAddingTeam(false);
    } catch (err) {
      console.error("Error adding team:", err);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    try {
      await deleteTeam(id);
    } catch (err) {
      console.error("Error deleting team:", err);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[--foreground]">Team Management</h1>

        {!isAddingTeam && isAuthenticated && (
          <button
            onClick={() => setIsAddingTeam(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary] transition-colors"
          >
            Add New Team
          </button>
        )}
      </div>

      {error && (
        <div className="card border-l-4 border-l-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-500">{error instanceof Error ? error.message : 'An error occurred'}</p>
            </div>
          </div>
        </div>
      )}

      {isAddingTeam ? (
        <TeamForm
          onSubmit={handleAddTeam}
          onCancel={() => setIsAddingTeam(false)}
        />
      ) : isLoading ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-[--primary] mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-[--muted]">Loading teams...</p>
        </div>
      ) : (
        <TeamList teams={teams} onDelete={handleDeleteTeam} isAuthenticated={isAuthenticated} />
      )}
    </div>
  );
} 