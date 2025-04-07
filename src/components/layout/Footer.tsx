"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[--card-bg]/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-[--muted] text-sm">
            © {new Date().getFullYear()} PGA2K25 Tracker
          </p>
          <div className="flex space-x-6">
            <Link
              href="https://ryanismy.name"
              className="text-[--muted] hover:text-[--primary] text-sm transition-colors"
            >
              Contact
            </Link>
            <Link
              href="https://github.com/rkadlick/pga2k-tracker"
              className="text-[--muted] hover:text-[--primary] text-sm transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
