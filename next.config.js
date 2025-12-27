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
  webpack: (config, { isServer }) => {
    // Externalize 'resend' to prevent webpack from trying to bundle it at build time
    // This allows the build to pass even if resend is not installed
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'resend': 'commonjs resend',
      })
    }
    return config
  },
}

module.exports = nextConfig

