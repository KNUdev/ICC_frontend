'use client'

import type {
  GradientConfig,
  LineConfig,
} from '@/shared/hooks/useAnimatedLines'
import { useAnimatedPulse } from '@/shared/hooks/useAnimatedPulse'
import { memo, useMemo } from 'react'
import { AnimatedLines } from '../AnimatedLines'

const historyPath =
  'M209.4 178.982V107.107H151.588C150.345 107.107 149.152 107.601 148.273 108.48C147.394 109.359 146.9 110.552 146.9 111.795V277.42C146.9 278.663 147.394 279.855 148.273 280.734C149.152 281.613 150.345 282.107 151.588 282.107H279.713C280.956 282.107 282.148 281.613 283.027 280.734C283.907 279.855 284.4 278.663 284.4 277.42V182.107H212.525C211.697 182.107 210.902 181.778 210.316 181.192C209.73 180.606 209.4 179.811 209.4 178.982Z'

const connectedPath =
  'M221.9 110.892V168.044C221.9 168.459 222.065 168.856 222.358 169.149C222.651 169.442 223.048 169.607 223.463 169.607H280.615C280.77 169.607 280.921 169.561 281.049 169.476C281.177 169.39 281.278 169.268 281.337 169.126C281.396 168.983 281.412 168.827 281.382 168.675C281.353 168.524 281.279 168.384 281.17 168.275L223.232 110.337C223.123 110.229 222.984 110.155 222.832 110.125C222.681 110.095 222.524 110.111 222.381 110.17C222.239 110.23 222.117 110.33 222.031 110.458C221.946 110.587 221.9 110.738 221.9 110.892Z'

const historyLines: LineConfig[] = [
  { d: 'M284 195.757H383.894V260.533H432', gradientId: 'gradient0' },
  { d: 'M254.341 89.0672H317.212V153.843H365.318', gradientId: 'gradient1' },
  { d: 'M179.565 89.0672H116.694V153.843H68.5879', gradientId: 'gradient2' },
  { d: 'M179.565 305.305H116.694V240.529H68.5879', gradientId: 'gradient3' },
  {
    d: 'M253.465 142.5V46.7002H350.629V-9.15527e-05',
    gradientId: 'gradient4',
  },
  {
    d: 'M179.164 107.5V46.7002L82 46.7002V-8.39233e-05',
    gradientId: 'gradient5',
  },
  { d: 'M179.533 282V349.576H82.3691V396.276', gradientId: 'gradient6' },
  { d: 'M253.835 282V349.576H351V396.276', gradientId: 'gradient7' },
  { d: 'M254.341 305.305H317.212V240.529H365.318', gradientId: 'gradient8' },
  { d: 'M147 195.757H48.1059L48.1059 130.981H0', gradientId: 'gradient9' },
]

const historyGradients: GradientConfig[] = [
  {
    id: 'gradient0',
    x1: '471.914',
    y1: '223.405',
    x2: '380.162',
    y2: '92.7944',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.149038', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient1',
    x1: '405.232',
    y1: '116.716',
    x2: '313.481',
    y2: '-13.8952',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient2',
    x1: '28.6743',
    y1: '116.716',
    x2: '120.425',
    y2: '-13.8952',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient3',
    x1: '28.6743',
    y1: '277.656',
    x2: '120.425',
    y2: '408.267',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient4',
    x1: '350.629',
    y1: '19.0516',
    x2: '249.501',
    y2: '144',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient5',
    x1: '82',
    y1: '19.0516',
    x2: '179.5',
    y2: '116',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient6',
    x1: '82.3691',
    y1: '377.224',
    x2: '184',
    y2: '273.499',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient7',
    x1: '351',
    y1: '377.224',
    x2: '248',
    y2: '274.499',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient8',
    x1: '405.232',
    y1: '277.656',
    x2: '313.481',
    y2: '408.267',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient9',
    x1: '-39.9136',
    y1: '168.108',
    x2: '51.8376',
    y2: '298.719',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
]

const FilterDefs = memo(() => (
  <defs>
    <filter
      id='filter0_d_559_6348'
      x='107'
      y='100'
      width='218.761'
      height='198.517'
      filterUnits='userSpaceOnUse'
      colorInterpolationFilters='sRGB'
    >
      <feFlood floodOpacity='0' result='BackgroundImageFix' />
      <feColorMatrix
        in='SourceAlpha'
        type='matrix'
        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
        result='hardAlpha'
      />
      <feOffset dy='4' />
      <feGaussianBlur stdDeviation='2' />
      <feComposite in2='hardAlpha' operator='out' />
      <feColorMatrix
        type='matrix'
        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
      />
      <feBlend
        mode='normal'
        in2='BackgroundImageFix'
        result='effect1_dropShadow_559_6348'
      />
      <feBlend
        mode='normal'
        in='SourceGraphic'
        in2='effect1_dropShadow_559_6348'
        result='shape'
      />
    </filter>
  </defs>
))
FilterDefs.displayName = 'FilterDefs'

export const AnimatedHistory = memo(function AnimatedHistory() {
  const { pulseStyle } = useAnimatedPulse()

  const animationConfig = useMemo(
    () => ({
      lines: historyLines,
      gradients: historyGradients,
      baseDuration: 2000,
      durationVariation: 1000,
      easing: 'ease-in-out',
    }),
    [],
  )

  return (
    <svg
      width='432'
      height='397'
      viewBox='0 0 432 397'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='animated-svg'
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      <FilterDefs />

      <g filter='url(#filter0_d_559_6348)'>
        <path d={historyPath} style={pulseStyle} className='animated-pulse' />
        <path d={connectedPath} style={pulseStyle} className='animated-pulse' />
      </g>

      <AnimatedLines {...animationConfig} className='animated-path' />
    </svg>
  )
})
