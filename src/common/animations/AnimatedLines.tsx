'use client'
import {
  useAnimatedLines,
  type GradientConfig,
  type LineConfig,
} from '@/shared/hooks/useAnimatedLines'
import { memo } from 'react'

interface AnimatedLinesProps {
  lines: LineConfig[]
  gradients: GradientConfig[]
  baseDuration?: number
  durationVariation?: number
  easing?: string
  className?: string
}

const GradientDefs = memo(({ gradients }: { gradients: GradientConfig[] }) => (
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
          <stop key={index} offset={stop.offset} stopColor={stop.stopColor} />
        ))}
      </linearGradient>
    ))}
  </defs>
))
GradientDefs.displayName = 'GradientDefs'

const AnimatedLine = memo(
  ({
    line,
    index,
    setPathRef,
    defaultLineStyles,
    className,
  }: {
    line: LineConfig
    index: number
    setPathRef: (index: number) => (ref: SVGPathElement | null) => void
    defaultLineStyles: React.CSSProperties
    className?: string
  }) => (
    <g>
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
  ),
)
AnimatedLine.displayName = 'AnimatedLine'

export const AnimatedLines = memo(function AnimatedLines(
  props: AnimatedLinesProps,
) {
  const { setPathRef, lines, gradients, defaultLineStyles, className } =
    useAnimatedLines(props)

  return (
    <>
      <GradientDefs gradients={gradients} />
      {lines.map((line, index) => (
        <AnimatedLine
          key={`${line.gradientId}-${index}`}
          line={line}
          index={index}
          setPathRef={setPathRef}
          defaultLineStyles={defaultLineStyles}
          className={className}
        />
      ))}
    </>
  )
})
