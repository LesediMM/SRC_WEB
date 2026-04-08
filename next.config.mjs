/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  swcMinify: true,
}

export default nextConfig