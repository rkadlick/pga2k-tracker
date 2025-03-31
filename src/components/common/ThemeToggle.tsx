import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check for system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl 
                bg-[--background] dark:bg-slate-800 
                hover:bg-[--primary]/5 dark:hover:bg-slate-700
                focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
                transition-all duration-200"
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
          className={`absolute w-5 h-5 text-amber-500 dark:text-slate-400
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
          className={`absolute w-5 h-5 text-slate-700 dark:text-blue-300
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