import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
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
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://massa-freelance.build.half-red.net",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
        ],
      },
    ];
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
