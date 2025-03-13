/**
 * Standardized error handling for API responses
 */

// Standard API response format
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string[];
  status?: number;
}

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Error class with additional metadata
export class ApiError extends Error {
  type: ErrorType;
  details?: string[];
  status: number;
  
  constructor(message: string, type: ErrorType, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.details = details;
  }
  
  // Convert to API response
  toResponse(): ApiResponse<never> {
    return {
      error: this.message,
      details: this.details,
      status: this.status
    };
  }
}

// Helper functions to create specific error types
export function validationError(message: string, details?: string[]): ApiError {
  return new ApiError(message, ErrorType.VALIDATION, 400, details);
}

export function notFoundError(message: string): ApiError {
  return new ApiError(message, ErrorType.NOT_FOUND, 404);
}

export function unauthorizedError(message: string = 'Unauthorized'): ApiError {
  return new ApiError(message, ErrorType.UNAUTHORIZED, 401);
}

export function forbiddenError(message: string = 'Forbidden'): ApiError {
  return new ApiError(message, ErrorType.FORBIDDEN, 403);
}

export function serverError(message: string = 'Internal Server Error'): ApiError {
  return new ApiError(message, ErrorType.SERVER_ERROR, 500);
}

// Format error for client response
export function formatError(error: unknown): ApiResponse<never> {
  if (error instanceof ApiError) {
    return error.toResponse();
  }
  
  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500
    };
  }
  
  return {
    error: 'An unknown error occurred',
    status: 500
  };
} 