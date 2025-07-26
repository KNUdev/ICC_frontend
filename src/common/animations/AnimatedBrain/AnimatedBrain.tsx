'use client'

import type {
  GradientConfig,
  LineConfig,
} from '@/shared/hooks/useAnimatedLines'
import { useAnimatedPulse } from '@/shared/hooks/useAnimatedPulse'
import { memo, useMemo } from 'react'
import { AnimatedLines } from '../AnimatedLines'

const brainPath =
  'M169.644 290.517C167.461 290.517 165.427 289.972 163.541 288.88C161.656 287.789 160.217 286.251 159.225 284.266L136.006 242.888H153.271L165.179 266.703H192.566V254.795H172.323L160.416 230.981H129.456L112.488 201.212C112.092 200.22 111.744 199.228 111.447 198.235C111.149 197.243 111 196.251 111 195.259C111 194.465 111.496 192.48 112.488 189.305L129.456 159.537H160.416L172.323 135.722H192.566V123.815H165.179L153.271 147.629H136.006L159.225 106.251C160.217 104.267 161.656 102.729 163.541 101.637C165.427 100.546 167.461 99.9998 169.644 99.9998H198.519C201.893 99.9998 204.721 101.141 207.003 103.423C209.286 105.705 210.427 108.533 210.427 111.907V159.537H192.566L180.658 171.444H210.427V207.166H184.23L172.323 183.351H144.936L133.029 195.259H165.179L177.086 219.073H210.427V278.61C210.427 281.984 209.286 284.812 207.003 287.094C204.721 289.376 201.893 290.517 198.519 290.517H169.644ZM234.242 290.517C230.868 290.517 228.04 289.376 225.757 287.094C223.475 284.812 222.334 281.984 222.334 278.61V219.073H255.675L267.582 195.259H299.732L287.825 183.351H260.438L248.53 207.166H222.334V171.444H252.103L240.195 159.537H222.334V111.907C222.334 108.533 223.475 105.705 225.757 103.423C228.04 101.141 230.868 99.9998 234.242 99.9998H263.117C265.3 99.9998 267.334 100.546 269.219 101.637C271.105 102.729 272.544 104.267 273.536 106.251L296.755 147.629H279.49L267.582 123.815H240.195V135.722H260.438L272.345 159.537H303.304L320.272 189.305C320.669 190.297 321.017 191.289 321.314 192.282C321.612 193.274 321.761 194.266 321.761 195.259C321.761 196.052 321.265 198.037 320.272 201.212L303.304 230.981H272.345L260.438 254.795H240.195V266.703H267.582L279.49 242.888H296.755L273.536 284.266C272.544 286.251 271.105 287.789 269.219 288.88C267.334 289.972 265.3 290.517 263.117 290.517H234.242Z'

const brainLines: LineConfig[] = [
  { d: 'M321.023 195.757H383.894V260.533H432', gradientId: 'gradient0' },
  { d: 'M254.342 89.067H317.213V153.843H365.319', gradientId: 'gradient1' },
  { d: 'M179.564 89.067H116.693V153.843H68.5874', gradientId: 'gradient2' },
  { d: 'M179.564 305.304H116.693V240.528H68.5874', gradientId: 'gradient3' },
  {
    d: 'M253.465 105.737V46.7002L350.629 46.7002V-0.000143151',
    gradientId: 'gradient4',
  },
  {
    d: 'M179.164 105.737V46.7002L81.9995 46.7002V-0.000143151',
    gradientId: 'gradient5',
  },
  { d: 'M179.534 290.539V349.576H82.3696V396.276', gradientId: 'gradient6' },
  { d: 'M253.835 290.539V349.576H351V396.276', gradientId: 'gradient7' },
  { d: 'M254.342 305.304H317.213V240.528H365.319', gradientId: 'gradient8' },
  { d: 'M110.977 195.757H48.1059L48.1059 130.981H0', gradientId: 'gradient9' },
]

const brainGradients: GradientConfig[] = [
  {
    id: 'gradient0',
    x1: '383.894',
    y1: '195.757',
    x2: '321.023',
    y2: '260.533',
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
    y2: '-13.8954',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient2',
    x1: '28.6738',
    y1: '116.716',
    x2: '120.425',
    y2: '-13.8954',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient3',
    x1: '28.6738',
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
    x2: '253.465',
    y2: '108.119',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient5',
    x1: '81.9995',
    y1: '19.0516',
    x2: '179.163',
    y2: '108.119',
    stops: [
      { offset: '0', stopColor: '#F6F6F6' },
      { offset: '0.0865385', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#FF525E' },
    ],
  },
  {
    id: 'gradient6',
    x1: '82.3696',
    y1: '377.224',
    x2: '179.534',
    y2: '288.157',
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
    x2: '253.836',
    y2: '288.157',
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

export const AnimatedBrain = memo(function AnimatedBrain() {
  const { pulseStyle } = useAnimatedPulse()

  const animationConfig = useMemo(
    () => ({
      lines: brainLines,
      gradients: brainGradients,
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
        <path d={brainPath} style={pulseStyle} className='animated-pulse' />
      </g>

      <AnimatedLines {...animationConfig} className='animated-path' />
    </svg>
  )
})
