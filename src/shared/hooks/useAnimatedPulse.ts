'use client'

export interface AnimatedPulseConfig {
  duration?: number
  easing?: string
  colors?: {
    from: string
    to: string
  }
}

const defaultConfig: Required<AnimatedPulseConfig> = {
  duration: 4000,
  easing: 'ease-in-out',
  colors: {
    from: '#ff7881',
    to: '#ff525e',
  },
}

export function useAnimatedPulse(config: AnimatedPulseConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config }

  const keyframeName = `pulse-${finalConfig.colors.from.replace(
    '#',
    '',
  )}-${finalConfig.colors.to.replace('#', '')}`

  const keyframes = `
    @keyframes ${keyframeName} {
      0% { fill: ${finalConfig.colors.from}; }
      50% { fill: ${finalConfig.colors.to}; }
      100% { fill: ${finalConfig.colors.from}; }
    }
  `

  if (typeof document !== 'undefined') {
    const styleId = `pulse-keyframes-${keyframeName}`
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = keyframes
      document.head.appendChild(style)
    }
  }

  const pulseStyle = {
    animation: `${keyframeName} ${finalConfig.duration}ms ${finalConfig.easing} infinite`,
  } as React.CSSProperties

  return { pulseStyle }
}
