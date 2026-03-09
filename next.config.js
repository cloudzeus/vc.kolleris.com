/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.bunny.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.getstream.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Turbopack is now default in Next.js 16
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
};

module.exports = nextConfig; 