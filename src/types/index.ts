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
	players: string[]; // Always 2 players
	is_your_team: boolean;
  }
  
  // Match types
  export type NinePlayed = 'front' | 'back';
  export type MatchResult = 'win' | 'loss';
  export type HoleResult = 'win' | 'loss' | 'tie';
  
  export interface Match extends BaseRecord {
	date: string; // ISO date string
	course_id: string;
	course_name: string;
	nine_played: NinePlayed;
	your_team_id: string;
	opponent_team_id: string;
	result: MatchResult;
	margin?: number; // 1-5 holes
	playoff_happened: boolean;
	notes?: string;
	tags?: string[];
	
	// Optional related data that might be joined
	your_team?: Team;
	opponent_team?: Team;
	hole_results?: HoleResult[];
	course?: Course;
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
  