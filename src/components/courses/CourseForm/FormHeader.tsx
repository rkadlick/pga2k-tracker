import React from 'react';

interface FormHeaderProps {
  courseName: string;
  setCourseName: (name: string) => void;
  error: string;
  clearError: () => void;
}

export default function FormHeader({ 
  courseName, 
  setCourseName, 
  error
}: FormHeaderProps) {
  return (
    <div>
      <label htmlFor="courseName" className="block text-lg font-medium text-[--foreground]">
        Course Name
      </label>
      <input
        type="text"
        id="courseName"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className={`mt-1 block w-full rounded-lg border-[--border] bg-[--input-bg] text-[--foreground] focus:border-[--primary] focus:ring-[--primary] sm:text-sm ${
          error ? 'border-red-500 dark:border-red-400' : ''
        }`}
        placeholder="Augusta National"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
