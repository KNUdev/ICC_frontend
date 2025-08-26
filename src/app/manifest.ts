import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ICC - Information Computing Center',
    short_name: 'ICC',
    description: 'Information Computing Center application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
