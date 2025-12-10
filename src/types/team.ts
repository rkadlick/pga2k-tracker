// src/types/team.ts

import { BaseRecord } from './base'

/** A golf team record as returned by the API */
export interface Team extends BaseRecord {
  name: string
  is_your_team?: boolean
}

/** A player record as returned by the API */
export interface Player extends BaseRecord {
  name: string
  recent_rating: number
}

/** Junction table row linking a player to a team */
export interface TeamMember extends BaseRecord {
  team_id: string
  player_id: string
}

/** Payload to create a new player */
export type PlayerCreateData = Omit<Player, keyof BaseRecord>

/** Payload to create a new team (with existing players) */
export interface TeamCreateData {
  name: string
  is_your_team?: boolean
  playerIds: string[]
}

/** Payload to update an existing team */
export type TeamUpdateData =
  Partial<Omit<Team, keyof BaseRecord>> &
  Pick<Team, 'id'>

/**
 * A team record with its player details populated.
 * Can be used for list/detail views.
 */
export interface TeamWithPlayers extends Team {
  players: Player[]
}
