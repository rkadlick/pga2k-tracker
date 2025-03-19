// Base types with common fields
export interface BaseRecord {
	id: string;
	created_at?: string;
	updated_at?: string;
  }
  
  // Course-related types
  export interface Course extends BaseRecord {
	name: string;
	holes?: Hole[];
	front_par: number;
	back_par: number;
	front_distance: number;
	back_distance: number;
	total_par: number;
	total_distance: number;
  }
  
  export interface Hole extends BaseRecord {
	course_id: string;
	hole_number: number;
	par: number;
	distance?: number;
  }
  
  // Team types
  export interface Team extends BaseRecord {
	name: string;
	players: string[]; // Always 2 players
	is_your_team: boolean;
  }
  
  // Match types
  export type NinePlayed = 'front' | 'back' | 'full';
  export type MatchResult = 'win' | 'loss' | 'tie';
  export type HoleResult = 'win' | 'loss' | 'tie';
  
  export interface Match extends BaseRecord {
	id: string;
	date_played: string;
	course_id: string;
	course_name?: string;
	your_team_id: string;
	your_team_name?: string;
	opponent_team_id: string;
	opponent_team_name?: string;
	nine_played: NinePlayed;
	your_team_score: number;
	opponent_team_score: number;
	winner_id: string | null;
	score_description?: string;
	margin?: number;
	playoffs: boolean;
	notes?: string;
	tags?: string[];
  }
  
  export interface HoleResultRecord extends BaseRecord {
	match_id: string;
	hole_number: number;
	result: HoleResult;
  }
  
  // For API responses
  export interface ApiResponse<T> {
	data?: T;
	error?: string;
  }
  
  // For state management
  export interface UserState {
	isAuthenticated: boolean;
	user?: any; // Define user type based on your auth provider
	loading: boolean;
  }
  