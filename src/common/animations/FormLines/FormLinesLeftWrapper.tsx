'use client'

import AnimatedLines from '../AnimatedLines/AnimatedLines'

const paths = [
  { d: 'M151.5 455.914 H0', id: 'gradient0' },
  {
    d: 'M0.000130562 1.77637L76.5918 1.77637L76.5918 456.894',
    id: 'gradient1',
  },
  { d: 'M0.000130562 876.776H76.5918L76.5918 456.894', id: 'gradient2' },
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
          id='gradient0'
          x1='151.5'
          y1='457.164'
          x2='0'
          y2='457.164'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient1'
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
          id='gradient2'
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

      {paths.map(({ d, id }, i) => (
        <AnimatedLines key={i} d={d} strokeId={id} />
      ))}
    </svg>
  )
}
