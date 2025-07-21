'use client'

import AnimatedLines from '../AnimatedLines/AnimatedLines'

const paths = [
  { d: 'M284 195.757H383.894V260.533H432', id: 'gradient0' },
  { d: 'M254.341 89.0672H317.212V153.843H365.318', id: 'gradient1' },
  { d: 'M179.565 89.0672H116.694V153.843H68.5879', id: 'gradient2' },
  { d: 'M179.565 305.305H116.694V240.529H68.5879', id: 'gradient3' },
  {
    d: 'M253.465 142.5V46.7002H350.629V-9.15527e-05',
    id: 'gradient4',
  },
  {
    d: 'M179.164 107.5V46.7002L82 46.7002V-8.39233e-05',
    id: 'gradient5',
  },
  { d: 'M179.533 282V349.576H82.3691V396.276', id: 'gradient6' },
  { d: 'M253.835 282V349.576H351V396.276', id: 'gradient7' },
  { d: 'M254.341 305.305H317.212V240.529H365.318', id: 'gradient8' },
  { d: 'M147 195.757H48.1059L48.1059 130.981H0', id: 'gradient9' },
]

export default function AnimatedLinesWrapper() {
  return (
    <svg
      width='432'
      height='397'
      viewBox='0 0 432 397'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          id='gradient0'
          x1='471.914'
          y1='223.405'
          x2='380.162'
          y2='92.7944'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.149038' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient1'
          x1='405.232'
          y1='116.716'
          x2='313.481'
          y2='-13.8952'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient2'
          x1='28.6743'
          y1='116.716'
          x2='120.425'
          y2='-13.8952'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient3'
          x1='28.6743'
          y1='277.656'
          x2='120.425'
          y2='408.267'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient4'
          x1='350.629'
          y1='19.0516'
          x2='249.501'
          y2='144'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient5'
          x1='82'
          y1='19.0516'
          x2='179.5'
          y2='116'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient6'
          x1='82.3691'
          y1='377.224'
          x2='184'
          y2='273.499'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient7'
          x1='351'
          y1='377.224'
          x2='248'
          y2='274.499'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient8'
          x1='405.232'
          y1='277.656'
          x2='313.481'
          y2='408.267'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient9'
          x1='-39.9136'
          y1='168.108'
          x2='51.8376'
          y2='298.719'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
      </defs>

      {paths.map(({ d, id }, i) => (
        <AnimatedLines key={i} d={d} strokeId={id} />
      ))}
    </svg>
  )
}
