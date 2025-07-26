'use client'

import type {
  FormLineConfig,
  GradientConfig,
} from '@/common/animations/FormLines/FormLinesAnimation'
import { AnimatedLines } from '../AnimatedLines'

const formRightLines: FormLineConfig[] = [
  { d: 'M0 455.914 H151.5', gradientId: 'rightGradient0', isMainLine: true },
  {
    d: 'M152 1.77637L75.4082 1.77637L75.4082 456.894',
    gradientId: 'rightGradient1',
    isMainLine: false,
  },
  {
    d: 'M152 876.776H75.4082L75.4082 456.894',
    gradientId: 'rightGradient2',
    isMainLine: false,
  },
]

const formRightGradients: GradientConfig[] = [
  {
    id: 'rightGradient0',
    x1: '0',
    y1: '457.164',
    x2: '151.5',
    y2: '457.164',
    stops: [
      { offset: '0.490385', stopColor: '#FF525E' },
      { offset: '0.759615', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#F5F5F5' },
    ],
  },
  {
    id: 'rightGradient1',
    x1: '75.4082',
    y1: '229.335',
    x2: '152',
    y2: '229.335',
    stops: [
      { offset: '0', stopColor: '#FF525E' },
      { offset: '0.591346', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#F5F5F5' },
    ],
  },
  {
    id: 'rightGradient2',
    x1: '75.4082',
    y1: '666.835',
    x2: '152',
    y2: '666.835',
    stops: [
      { offset: '0', stopColor: '#FF525E' },
      { offset: '0.591346', stopColor: '#DCDCDC' },
      { offset: '1', stopColor: '#F5F5F5' },
    ],
  },
]

export default function FormLinesRightWrapper() {
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
          lines={formRightLines}
          gradients={formRightGradients}
          mainLineDuration={1500}
          sideLineDuration={1500}
          cycleDuration={4000}
        />
      </svg>
    </div>
  )
}
