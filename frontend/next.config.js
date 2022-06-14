/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: '/auction',
  reactStrictMode: true,
  rewrites() {
    return [{ source: '/auction/_next/:path*', destination: '/_next/:path*' }]
  },
}

module.exports = nextConfig
