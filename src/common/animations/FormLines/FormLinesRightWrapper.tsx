'use client'

import AnimatedLines from '../AnimatedLines/AnimatedLines'

const paths = [
  { d: 'M0 455.914 H151.5', id: 'rightGradient0', isMainLine: true },
  {
    d: 'M152 1.77637L75.4082 1.77637L75.4082 456.894',
    id: 'rightGradient1',
    isMainLine: false,
  },
  {
    d: 'M152 876.776H75.4082L75.4082 456.894',
    id: 'rightGradient2',
    isMainLine: false,
  },
]

export default function FormLinesRightWrapper() {
  return (
    <svg
      width='152'
      height='879'
      viewBox='0 0 152 879'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          id='rightGradient0'
          x1='0'
          y1='457.164'
          x2='151.5'
          y2='457.164'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.490385' stopColor='#FF525E' />
          <stop offset='0.759615' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#F5F5F5' />
        </linearGradient>
        <linearGradient
          id='rightGradient1'
          x1='75.4082'
          y1='229.335'
          x2='152'
          y2='229.335'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FF525E' />
          <stop offset='0.591346' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#F5F5F5' />
        </linearGradient>
        <linearGradient
          id='rightGradient2'
          x1='75.4082'
          y1='666.835'
          x2='152'
          y2='666.835'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FF525E' />
          <stop offset='0.591346' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#F5F5F5' />
        </linearGradient>
      </defs>

      {paths.map(({ d, id, isMainLine }, i) => (
        <AnimatedLines key={i} d={d} strokeId={id} isMainLine={isMainLine} />
      ))}
    </svg>
  )
}
