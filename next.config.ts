import type { NextConfig } from "next";
import path from "path";

const isDeweb = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "deweb";

const nextConfig: NextConfig = {
  /* config options here */
  output: isDeweb ? "export" : undefined,
  reactCompiler: true,
  transpilePackages: [
    "@massalabs/react-ui-kit",
    "@massalabs/wallet-provider",
  ],
  typescript: {
    // Allow production builds to succeed even if there are TS errors.
    // This is mainly to avoid blocking Vercel builds on AssemblyScript contract types.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@massalabs/massa-web3': path.resolve(__dirname, 'src/vendor/massa-web3/dist/esm/index.js'),
      '@massalabs/wallet-provider': path.resolve(__dirname, 'src/vendor/wallet-provider/dist/esm/index.js'),
    };
    return config;
  },
};

export default nextConfig;
