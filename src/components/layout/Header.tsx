'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { IoGolf } from "react-icons/io5";
import { MobileNavLinkProps, NavLinkProps } from '@/types';

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
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 font-bold text-xl text-[--foreground] hover:text-[--primary] transition-colors"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              <IoGolf className="w-8 h-8" />
              <span>PGA2K25 Tracker</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Absolutely Centered */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="flex items-center space-x-8">
              <NavLink href="/" label="Home" pathname={pathname} />
              <NavLink href="/matches" label="Matches" pathname={pathname} />
              <NavLink href="/courses" label="Courses" pathname={pathname} />
              <NavLink href="/teams" label="Teams" pathname={pathname} />
            </nav>
          </div>
          
          {/* Right side items */}
          <div className="flex-1 flex justify-end items-center space-x-4">            
            <div className="min-w-[100px] flex justify-end">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[--muted] hidden sm:inline">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="sign-out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center"
                >
                  <button>Sign In</button>
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

function NavLink({ href, label, pathname }: NavLinkProps) {
  const isActive = pathname === href || 
    (href !== '/' && pathname?.startsWith(href));
  
  return (
    <Link 
      href={href}
      style={{ fontFamily: 'var(--font-tertiary)' }}
      className={`text-lg font-medium transition-colors hover:text-[--primary] hover:underline ${
        isActive 
          ? 'text-[--primary] font-semibold underline underline-offset-4' 
          : 'text-[--muted] hover:text-[--muted-hover]'
      }`}
    >
      {label}
    </Link>
  );
}



function MobileNavLink({ href, label, pathname, onClick }: MobileNavLinkProps) {
  const isActive = pathname === href || 
    (href !== '/' && pathname?.startsWith(href));
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      style={{ fontFamily: 'var(--font-tertiary)' }}
      className={`text-lg font-medium px-4 py-2 rounded-lg transition-colors hover:underline
                 ${isActive 
                   ? 'bg-[--primary]/10 text-[--primary] underline underline-offset-4' 
                   : 'text-[--muted] hover:text-[--muted-hover] hover:bg-[--primary]/5'
                 }`}
    >
      {label}
    </Link>
  );
}
