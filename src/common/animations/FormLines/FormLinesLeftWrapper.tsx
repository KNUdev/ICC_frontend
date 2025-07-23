'use client'

import AnimatedLines from '../AnimatedLines/AnimatedLines'

const paths = [
  { d: 'M151.5 455.914 H0', id: 'leftGradient0', isMainLine: true },
  {
    d: 'M0.000130562 1.77637L76.5918 1.77637L76.5918 456.894',
    id: 'leftGradient1',
    isMainLine: false,
  },
  {
    d: 'M0.000130562 876.776H76.5918L76.5918 456.894',
    id: 'leftGradient2',
    isMainLine: false,
  },
]

export default function FormLinesLeftWrapper() {
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
          id='leftGradient0'
          x1='151.5'
          y1='457.164'
          x2='0'
          y2='457.164'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0.490385' stopColor='#FF525E' />
          <stop offset='0.759615' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#F5F5F5' />
        </linearGradient>
        <linearGradient
          id='leftGradient1'
          x1='76.5918'
          y1='229.335'
          x2='0.0001297'
          y2='229.335'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FF525E' />
          <stop offset='0.591346' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#F5F5F5' />
        </linearGradient>
        <linearGradient
          id='leftGradient2'
          x1='76.5918'
          y1='666.835'
          x2='0.0001297'
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
