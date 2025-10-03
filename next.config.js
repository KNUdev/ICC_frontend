const createNextIntlPlugin = require('next-intl/plugin')
const withPWAInit = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    })
    return config
  },

  ...(process.env.NODE_ENV === 'production' && {
    images: {
      domains: ['knu-icc.netlify.app'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'multiparous-waggly-krysta.ngrok-free.dev',
          pathname: '/images/**',
        },
      ],
      loader: 'custom',
      loaderFile: 'src/shared/lib/netlifyImageLoader.ts',
    },
  }),
  ...(process.env.NODE_ENV === 'development' && {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5003',
          pathname: '/images/**',
        },
      ],
    },
  }),
}

const withNextIntl = createNextIntlPlugin()

const withPWA = withPWAInit({
  dest: 'public',
  register: false, // We'll register SW manually via a client component
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
})

module.exports = withNextIntl(withPWA(nextConfig))
