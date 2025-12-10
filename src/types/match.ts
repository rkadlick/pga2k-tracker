// src/types/match.ts

import { BaseRecord } from './base'
import { Team } from './team'

/**
 * Which nine(s) were played.
 */
export type NinePlayed = 'front' | 'back' | 'all'

/**
 * Overall match result.
 */
export type MatchResult = 'win' | 'loss' | 'tie'

/**
 * Per-hole outcome.
 */
export type HoleResult = 'win' | 'loss' | 'tie' | null

/**
 * A single hole-result record as stored in the DB.
 */
export interface HoleResultRecord extends BaseRecord {
  match_id: string
  hole_number: number
  result: HoleResult
}

/**
 * A head-to-head match between two teams/players.
 * Includes optional populated names/objects when you do a JOIN.
 */
export interface Match extends BaseRecord {
  date_played: string

  course_id: string
  your_team_id: string
  opponent_team_id: string

  player1_id: string
  player1_name?: string | { name: string }
  player1_rating: number

  player2_id: string
  player2_name?: string | { name: string }
  player2_rating: number

  opponent1_id: string
  opponent1_name?: string | { name: string }
  opponent1_rating: number

  opponent2_id: string
  opponent2_name?: string | { name: string }
  opponent2_rating: number

  nine_played: NinePlayed

  holes_won: number
  holes_tied: number
  holes_lost: number

  winner_id: string | null
  rating_change?: number
  playoffs: boolean
  season: number

  notes?: string
  tags?: string[]

  /** If you fetch the hole-by-hole breakdown */
  hole_results?: HoleResultRecord[]

  /** If you joined in the course/team names */
  course?: string | { name: string }
  your_team?: string | { name: string }
  opponent_team?: string | { name: string }
}

/**
 * Payload to create a new match.
 * (omits id/created_at/updated_at)
 */
export interface MatchCreateData {
  date_played: string

  course_id: string
  your_team_id: string
  opponent_team_id: string

  player1_id: string
  player1_rating: number

  player2_id: string
  player2_rating: number

  opponent1_id: string
  opponent1_rating: number

  opponent2_id: string
  opponent2_rating: number

  nine_played: NinePlayed

  holes_won: number
  holes_tied: number
  holes_lost: number

  winner_id: string | null
  rating_change?: number
  playoffs: boolean
  season: number

  notes?: string
  tags?: string[]

  hole_results?: Array<{
    hole_number: number
    result: HoleResult
  }>
}

/**
 * Form state used when creating a match.
 */
export interface MatchFormData {
  date_played: string
  course_id: string | null
  nine_played: NinePlayed
  opponent_team_id: string | null
  player1_id?: string
  player1_rating?: number
  player2_id?: string
  player2_rating?: number
  opponent1_id?: string
  opponent1_rating?: number
  opponent2_id?: string
  opponent2_rating?: number
  holes_won?: number
  holes_tied?: number
  holes_lost?: number
  winner_id?: string | null
  hole_results: Array<{
    hole_number: number
    result: HoleResult
  }>
  rating_change: number
  playoffs: boolean
  notes?: string
  tags?: string[]
  season?: number
}

/** Ref exposed by MatchForm for imperative helpers */
export interface MatchFormRef {
  resetForm: () => void
}

/** Props for the MatchForm component */
export interface MatchFormProps {
  yourTeam: Team | null
  onSubmit: (data: MatchFormData) => Promise<void> | void
}

/** Simple player shape used when selecting team players */
export interface TeamPlayerDetails {
  id: string
  name: string
  recent_rating: number
}

/**
 * Payload to update an existing match.
 * You must supply `id`, plus any fields you want to change.
 */
export type MatchUpdateData =
  Partial<Omit<Match, keyof BaseRecord | 'hole_results'>> &
  Pick<Match, 'id'> & {
    /** Derived field used to adjust player ratings without persisting */
    recent_rating_change?: number
    /** Simplified hole results payload when updating a match */
    hole_results?: Array<{
      hole_number: number
      result: HoleResult
    }>
  }
