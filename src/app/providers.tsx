"use client"; // Mark this as a Client Component

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Avoid hydration mismatch by mounting ThemeProvider only on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render nothing or a fallback on the server
    // to avoid hydration mismatch before client mount
    // You could return null or a simple fragment
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}