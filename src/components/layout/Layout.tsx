'use client'
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8 animate-fade-in">
        {children}
      </main>
      <footer className="bg-[--card-bg] border-t border-[--border] py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-[--muted] text-sm">
              © {new Date().getFullYear()} PGA2K25 Tracker
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-[--muted] hover:text-[--primary] text-sm">Privacy Policy</a>
              <a href="#" className="text-[--muted] hover:text-[--primary] text-sm">Terms of Service</a>
              <a href="#" className="text-[--muted] hover:text-[--primary] text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
