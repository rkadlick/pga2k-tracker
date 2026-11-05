import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is a read-only archive, so the sign-in and data entry pages aren't reachable.
  async redirects() {
    return [
      { source: "/login", destination: "/", permanent: false },
      { source: "/matches/new", destination: "/matches", permanent: false },
      { source: "/matches/:id/edit", destination: "/matches/:id", permanent: false },
    ];
  },
};

export default nextConfig;
