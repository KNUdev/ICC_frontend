'use client'
import {
  useAnimatedLines,
  type GradientConfig,
  type LineConfig,
} from '@/shared/hooks/useAnimatedLines'

interface AnimatedLinesProps {
  lines: LineConfig[]
  gradients: GradientConfig[]
  baseDuration?: number
  durationVariation?: number
  easing?: string
  className?: string
}

export function AnimatedLines(props: AnimatedLinesProps) {
  const { setPathRef, lines, gradients, defaultLineStyles, className } =
    useAnimatedLines(props)

  return (
    <>
      <defs>
        {gradients.map((gradient) => (
          <linearGradient
            key={gradient.id}
            id={gradient.id}
            x1={gradient.x1}
            y1={gradient.y1}
            x2={gradient.x2}
            y2={gradient.y2}
            gradientUnits='userSpaceOnUse'
          >
            {gradient.stops.map((stop, index) => (
              <stop
                key={index}
                offset={stop.offset}
                stopColor={stop.stopColor}
              />
            ))}
          </linearGradient>
        ))}
      </defs>

      {lines.map((line, index) => (
        <g key={index}>
          <path
            d={line.d}
            stroke={`url(#${line.gradientId})`}
            style={{
              ...defaultLineStyles,
              strokeOpacity: 0.2,
            }}
            className={className}
          />
          <path
            ref={setPathRef(index)}
            d={line.d}
            stroke={`url(#${line.gradientId})`}
            style={defaultLineStyles}
            className={className}
          />
        </g>
      ))}
    </>
  )
}
