import { ReactNode } from "react";

// Base types with common fields
export interface BaseRecord {
	id: string;
	created_at: string;
	updated_at: string;
}


// For API responses
export interface ApiResponse<T> {
	data?: T;
	error?: string;
}
  



  export interface ErrorStateProps {
	message: string;
  }

  export interface LoadingStateProps {
	message?: string;
  }

  export interface ValidationErrorsProps {
	errors: string[];
  }

  export interface FormHeaderProps {
	courseName: string;
	setCourseName: (name: string) => void;
	error: string;
	clearError: () => void;
  }



  export interface LayoutProps {
	children: ReactNode;
  }

  export interface EmptyStateProps {
	isAuthenticated: boolean;
	title?: string;
	description?: string;
	actionLabel?: string;
	actionPath?: string;
  }

  export interface UseApiRequestOptions<T, P extends unknown[]> {
	onSuccess?: (data: T, args: P) => void;
	onError?: (error: Error) => void;
  }

  export type ValidationRule<T> = (value: T) => string | null;

export type FieldValidators<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export interface FormOptions<T> {
  initialValues: T;
  validators?: FieldValidators<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}



export interface ApiResponse<T> {
	data?: T;
	error?: string;
	details?: string[];
	status?: number;
  }