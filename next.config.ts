import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@massalabs/react-ui-kit"],
  typescript: {
    // Allow production builds to succeed even if there are TS errors.
    // This is mainly to avoid blocking Vercel builds on AssemblyScript contract types.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
