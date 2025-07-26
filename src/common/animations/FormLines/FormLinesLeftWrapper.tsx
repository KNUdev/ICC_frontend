'use client'

import type {
  FormLineConfig,
  GradientConfig,
} from '@/common/animations/FormLines/FormLinesAnimation'
import { AnimatedLines } from '../AnimatedLines'

const formLeftLines: FormLineConfig[] = [
  { d: 'M151.5 455.914 H0', gradientId: 'leftGradient0', isMainLine: true },
  {
    d: 'M0.000130562 1.77637L76.5918 1.77637L76.5918 456.894',
    gradientId: 'leftGradient1',
    isMainLine: false,
  },
  {
    d: 'M0.000130562 876.776H76.5918L76.5918 456.894',
    gradientId: 'leftGradient2',
    isMainLine: false,
  },
]

const formLeftGradients: GradientConfig[] = [
  {
    id: 'leftGradient0',
    x1: '151.5',
    y1: '457.164',
    x2: '0',
    y2: '457.164',
    stops: [
      { offset: '0.490385', stopColor: '#FF525E' },
      { offset: '0.759615', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#F5F5F5' },
    ],
  },
  {
    id: 'leftGradient1',
    x1: '76.5918',
    y1: '229.335',
    x2: '0.0001297',
    y2: '229.335',
    stops: [
      { offset: '0', stopColor: '#FF525E' },
      { offset: '0.591346', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#F5F5F5' },
    ],
  },
  {
    id: 'leftGradient2',
    x1: '76.5918',
    y1: '666.835',
    x2: '0.0001297',
    y2: '666.835',
    stops: [
      { offset: '0', stopColor: '#FF525E' },
      { offset: '0.591346', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#F5F5F5' },
    ],
  },
]

export default function FormLinesLeftWrapper() {
  return (
    <div className='svg-container'>
      <svg
        width='152'
        height='879'
        viewBox='0 0 152 879'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{
          contain: 'layout style paint',
          willChange: 'auto',
          transform: 'translateZ(0)',
        }}
      >
        <AnimatedLines
          mode='synchronized'
          lines={formLeftLines}
          gradients={formLeftGradients}
          mainLineDuration={1500}
          sideLineDuration={1500}
          cycleDuration={4000}
        />
      </svg>
    </div>
  )
}
