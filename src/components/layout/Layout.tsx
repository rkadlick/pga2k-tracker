"use client";

import Header from "./Header";
import Footer from "./Footer";
import ThemeToggle from "@/components/common/ThemeToggle";
import { LayoutProps } from "@/types";



export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[--background]">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8 animate-fade-in">
        {children}
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  );
}
