// Base types with common fields
export interface BaseRecord {
	id: string;
	created_at: string;
	updated_at: string;
}

// User types
export interface User {
	id: string;
	email: string;
	created_at?: string;
	updated_at?: string;
}

// For state management
export interface UserState {
	isAuthenticated: boolean;
	user?: User;
	loading: boolean;
}

// Course-related types
export interface Course extends BaseRecord {
	name: string;
	holes?: Hole[];
	front_par?: number;
	back_par?: number;
	front_distance?: number;
	back_distance?: number;
	total_par?: number;
	total_distance?: number;
	wins?: number;
	losses?: number;
}

export interface Hole extends BaseRecord {
	course_id: string;
	hole_number: number;
	par: number;
	distance: number;
}

// Team types
export interface Team extends BaseRecord {
	name: string;
	is_your_team?: boolean;
	players?: {
		id: string;
		name: string;
		recent_rating: number;
	}[];
}

export interface Player {
	id: string;
	name: string;
	created_at: string;
	recent_rating: number;
}

export interface TeamMember extends BaseRecord {
	id: string;
	team_id: string;
	player_id: string;
}

// Match types
export type NinePlayed = 'front' | 'back' | 'all';
export type MatchResult = 'win' | 'loss' | 'tie';
export type HoleResult = 'win' | 'loss' | 'tie' | null;

export interface Match extends BaseRecord {
	date_played: string;
	course_id: string;
	your_team_id: string;
	opponent_team_id: string;
	player1_id: string;
	player1_name?: string | {name: string};
	player1_rating: number;
	player2_id: string;
	player2_name?: string | {name: string};
	player2_rating: number;
	opponent1_id: string;
	opponent1_name?: string | {name: string};
	opponent1_rating: number;
	opponent2_id: string;
	opponent2_name?: string | {name: string};
	opponent2_rating: number;
	nine_played: NinePlayed;
	holes_won: number;
	holes_tied: number;
	holes_lost: number;
	winner_id: string | null;
	rating_change?: number;	
	playoffs: boolean;
	season: number;
	notes?: string;
	tags?: string[];
	hole_results?: HoleResultRecord[];
	course: string | {name: string};
	your_team: string | {name: string};
	opponent_team: string | {name: string};
}

export interface HoleResultRecord {
    id: string;
    match_id: string;
    hole_number: number;
    result: HoleResult;
    created_at: string;
    updated_at: string;
  }

// For API responses
export interface ApiResponse<T> {
	data?: T;
	error?: string;
}
  