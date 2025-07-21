import AnimatedLines from '../AnimatedLines/AnimatedLines'

const paths = [
  { d: 'M321.023 195.757H383.894V260.533H432', id: 'gradient0' },
  { d: 'M254.342 89.067H317.213V153.843H365.319', id: 'gradient1' },
  { d: 'M179.564 89.067H116.693V153.843H68.5874', id: 'gradient2' },
  { d: 'M179.564 305.304H116.693V240.528H68.5874', id: 'gradient3' },
  {
    d: 'M253.465 105.737V46.7002L350.629 46.7002V-0.000143151',
    id: 'gradient4',
  },
  {
    d: 'M179.164 105.737V46.7002L81.9995 46.7002V-0.000143151',
    id: 'gradient5',
  },
  { d: 'M179.534 290.539V349.576H82.3696V396.276', id: 'gradient6' },
  { d: 'M253.835 290.539V349.576H351V396.276', id: 'gradient7' },
  { d: 'M254.342 305.304H317.213V240.528H365.319', id: 'gradient8' },
  { d: 'M110.977 195.757H48.1059L48.1059 130.981H0', id: 'gradient9' },
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
          x1='383.894'
          y1='195.757'
          x2='321.023'
          y2='260.533'
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
          y2='-13.8954'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient2'
          x1='28.6738'
          y1='116.716'
          x2='120.425'
          y2='-13.8954'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient3'
          x1='28.6738'
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
          x2='253.465'
          y2='108.119'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient5'
          x1='81.9995'
          y1='19.0516'
          x2='179.163'
          y2='108.119'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F6F6F6' />
          <stop offset='0.0865385' stopColor='#DCDCDC' />
          <stop offset='1' stopColor='#FF525E' />
        </linearGradient>
        <linearGradient
          id='gradient6'
          x1='82.3696'
          y1='377.224'
          x2='179.534'
          y2='288.157'
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
          x2='253.836'
          y2='288.157'
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
