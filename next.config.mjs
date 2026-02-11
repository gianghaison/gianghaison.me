/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2.gianghaison.me',
      },
    ],
  },
  devIndicators: false,
}

export default nextConfig
