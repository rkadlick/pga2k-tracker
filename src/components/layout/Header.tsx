'use client'

// src/components/layout/Header.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
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
        
        <div className="md:hidden">
          {/* Mobile menu button - we'll implement this later */}
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
