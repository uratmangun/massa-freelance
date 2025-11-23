import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['@massalabs/react-ui-kit'],
};

export default nextConfig;
