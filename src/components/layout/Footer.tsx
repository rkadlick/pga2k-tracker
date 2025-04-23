"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer className="bg-[--card-bg]/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center space-x-8">
          {!isHomePage && (
            <div className="relative w-[30px] h-[60px]">
              <Image
                src="/rk.png"
                alt="Miniature golfer left"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
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
          {!isHomePage && (
            <div className="relative w-[30px] h-[60px]">
              <Image
                src="/tj.png"
                alt="Miniature golfer right"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
