declare module '*.svg' {
  import React from 'react'
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module 'next-pwa' {
  import type { NextConfig } from 'next'
  type PWAOptions = {
    dest?: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    buildExcludes?: RegExp[]
    cacheOnFrontEndNav?: boolean
    extendDefaultRuntimeCaching?: boolean
    [key: string]: unknown
  }
  export default function withPWA(
    options?: PWAOptions,
  ): (config: NextConfig) => NextConfig
}
