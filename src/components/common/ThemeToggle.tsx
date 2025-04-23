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
      <div className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[var(--card-bg)] border border-[var(--border)]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full
                bg-[var(--card-bg)] text-[var(--foreground)]
                border border-[var(--border)]
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-in-out
                overflow-hidden
                before:content-[''] before:absolute 
                before:-left-[25%] before:-top-[25%]
                before:w-[150%] before:h-[150%]
                before:bg-[var(--background)] before:rounded-full
                before:scale-0 hover:before:scale-100
                before:transition-transform before:duration-300
                before:origin-center
                active:shadow-inner active:scale-95"
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Sun icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className={`absolute w-7 h-7 text-[var(--foreground)]
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
          className={`absolute w-7 h-7 text-[var(--foreground)]
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
