import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[--background] border border-[--border]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {/* Sun icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className={`absolute w-5 h-5 text-amber-500 dark:text-amber-400
                     transition-all duration-300 ease-in-out
                     ${theme === 'light' 
                       ? 'scale-100 rotate-0 opacity-100' 
                       : 'scale-0 rotate-90 opacity-0'}`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.828-6.828L15.757 6.586M8.243 17.414 6.828 18.828M6.828 5.172 8.243 6.586m8.929 10.828 1.414 1.414" />
        </svg>
        
        {/* Moon icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className={`absolute w-5 h-5 text-slate-800 dark:text-blue-300
                     transition-all duration-300 ease-in-out
                     ${theme === 'dark' 
                       ? 'scale-100 rotate-0 opacity-100' 
                       : 'scale-0 -rotate-90 opacity-0'}`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </button>
  );
}
