/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/playbook',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/playbook/:path*',
        destination: '/events',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

