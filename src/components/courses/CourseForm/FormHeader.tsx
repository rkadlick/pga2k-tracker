import React from 'react';
import { FormHeaderProps } from '@/types';

export default function FormHeader({ 
  courseName, 
  setCourseName, 
  error
}: FormHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-[--foreground] mb-6">
        Course Details
      </h3>
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
