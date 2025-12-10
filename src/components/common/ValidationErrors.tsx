
import { ValidationErrorsProps } from '@/types';

export default function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-rose-50 dark:bg-rose-500/10 rounded-xl shadow-sm animate-fade-in">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-rose-400 dark:text-rose-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-rose-800 dark:text-rose-200">
              There were errors with your submission
            </h3>
            <div className="mt-2">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-rose-700 dark:text-rose-300"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 