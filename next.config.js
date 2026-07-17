/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: false },
  images: {
    domains: ['upload.wikimedia.org', 'commons.wikimedia.org'],
  },
};

module.exports = nextConfig;