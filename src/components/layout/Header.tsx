'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user immediately on mount and after any route change
    const fetchUser = async () => {
      setLoading(true); // Show loading state while checking
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    
    fetchUser();
    
    // Set up auth state change listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user || null);
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]); // Add pathname as a dependency to re-run on route changes
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };
  
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          PGA2K25 Tracker
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <NavLink href="/" label="Home" pathname={pathname} />
          <NavLink href="/matches" label="Matches" pathname={pathname} />
          <NavLink href="/courses" label="Courses" pathname={pathname} />
          <NavLink href="/teams" label="Teams" pathname={pathname} />
        </nav>
        
        <div className="flex items-center space-x-4">
          {!loading && (
            user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm hidden sm:inline">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Sign In
              </Link>
            )
          )}
          
          <div className="md:hidden">
            {/* Mobile menu button */}
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
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
      className={`transition-colors hover:text-blue-300 ${
        isActive ? 'font-semibold text-blue-400' : ''
      }`}
    >
      {label}
    </Link>
  );
}
