/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Render deployment configuration
  output: 'standalone',
  swcMinify: true,
}

export default nextConfig
