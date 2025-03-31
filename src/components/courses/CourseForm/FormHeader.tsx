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
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[--foreground] mb-4">
        Course Details
      </h2>
      <label htmlFor="courseName" className="block text-sm font-medium text-[--muted] mb-2">
        Course Name
      </label>
      <input
        type="text"
        id="courseName"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className={`block w-full rounded-lg bg-[--input-bg] text-[--foreground] border border-[--border] focus:border-[--primary] focus:ring-[--primary] transition-colors ${
          error ? 'border-red-500' : ''
        }`}
        placeholder="Augusta National"
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
