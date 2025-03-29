'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };
  
  return (
    <header className="bg-[--card-bg]/80 backdrop-blur-sm border-b border-[--border] sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="font-bold text-xl text-[--foreground] hover:text-[--primary] transition-colors"
          >
            PGA2K25 Tracker
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" pathname={pathname} />
            <NavLink href="/matches" label="Matches" pathname={pathname} />
            <NavLink href="/courses" label="Courses" pathname={pathname} />
            <NavLink href="/teams" label="Teams" pathname={pathname} />
          </nav>
          
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            
            {!loading && (
              isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[--muted] hidden sm:inline">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="text-sm bg-[--primary]/10 text-[--primary] hover:bg-[--primary]/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )
            )}
            
            <div className="md:hidden">
              <button className="p-2 hover:bg-[--primary]/10 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
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
      className={`text-sm font-medium transition-colors hover:text-[--primary] ${
        isActive 
          ? 'text-[--primary] font-semibold' 
          : 'text-[--muted]'
      }`}
    >
      {label}
    </Link>
  );
}
