'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[--border] backdrop-blur-md bg-[--background]/80">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 font-bold text-xl text-[--foreground] hover:text-[--primary] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>PGA2K25 Tracker</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" pathname={pathname} />
            <NavLink href="/matches" label="Matches" pathname={pathname} />
            <NavLink href="/courses" label="Courses" pathname={pathname} />
            <NavLink href="/teams" label="Teams" pathname={pathname} />
          </nav>
          
          {/* Right side items */}
          <div className="flex items-center space-x-4">            
            <div className="min-w-[100px] flex justify-end">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[--muted] hidden sm:inline">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm bg-rose-500/10 text-rose-600 dark:text-rose-400
                             hover:bg-rose-500/20 rounded-lg px-4 py-2 
                             transition-colors shadow-none"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="text-sm bg-[--primary]/10 text-[--primary] hover:bg-[--primary]/20 
                           px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 
                         hover:bg-[--primary]/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4 pb-4">
              <MobileNavLink href="/" label="Home" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/matches" label="Matches" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/courses" label="Courses" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/teams" label="Teams" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  pathname: string | null;
}

function NavLink({ href, label, pathname }: NavLinkProps) {
  const isActive = pathname === href || 
    (href !== '/' && pathname?.startsWith(href));
  
  return (
    <Link 
      href={href}
      className={`text-sm font-medium transition-colors hover:text-[--primary] ${
        isActive 
          ? 'text-[--primary] font-semibold' 
          : 'text-[--muted] hover:text-[--muted-hover]'
      }`}
    >
      {label}
    </Link>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ href, label, pathname, onClick }: MobileNavLinkProps) {
  const isActive = pathname === href || 
    (href !== '/' && pathname?.startsWith(href));
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors
                 ${isActive 
                   ? 'bg-[--primary]/10 text-[--primary]' 
                   : 'text-[--muted] hover:text-[--muted-hover] hover:bg-[--primary]/5'
                 }`}
    >
      {label}
    </Link>
  );
}
