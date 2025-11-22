/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors should be fixed, not ignored in production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },
  // Enable image optimization for production
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [],
  },
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // PWA Configuration
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ]
  },
}

export default nextConfig
