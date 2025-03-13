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
  error, 
  clearError 
}: FormHeaderProps) {
  return (
    <div>
      <label htmlFor="courseName" className="block text-lg font-medium text-gray-700">
        Course Name
      </label>
      <input
        type="text"
        id="courseName"
        value={courseName}
        onChange={(e) => {
          setCourseName(e.target.value);
          if (error) {
            clearError();
          }
        }}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg ${
          error ? 'border-red-300' : ''
        }`}
        placeholder="Augusta National"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
