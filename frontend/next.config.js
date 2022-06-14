/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: '/lottery',
  reactStrictMode: true,
  rewrites() {
    return [{ source: '/lottery/_next/:path*', destination: '/_next/:path*' }]
  },
}

module.exports = nextConfig
