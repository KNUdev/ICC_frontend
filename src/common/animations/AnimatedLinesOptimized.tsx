'use client'
import {
  useAnimatedLinesOptimized,
  type AnimatedLinesConfig,
} from './hooks/useAnimatedLinesOptimized'
import { useAnimationPerformance } from './hooks/useAnimationPerformance'

interface OptimizedAnimatedLinesProps
  extends Omit<AnimatedLinesConfig, 'threshold' | 'staggerDelay'> {
  width?: number
  height?: number
  viewBox?: string
}

export function AnimatedLinesOptimized({
  lines,
  gradients,
  baseDuration = 2000,
  durationVariation = 1000,
  easing = 'ease-in-out',
  className = '',
  width = 100,
  height = 100,
  viewBox = '0 0 100 100',
}: OptimizedAnimatedLinesProps) {
  const { animationConfig, canAnimate } = useAnimationPerformance()

  const {
    setPathRef,
    containerRef,
    lines: configLines,
    gradients: configGradients,
    defaultLineStyles,
    className: configClassName,
  } = useAnimatedLinesOptimized({
    lines,
    gradients,
    baseDuration: canAnimate
      ? animationConfig.lines.duration || baseDuration
      : 0,
    durationVariation,
    easing,
    className,
    threshold: animationConfig.lines.threshold,
    staggerDelay: animationConfig.lines.staggerDelay,
  })

  if (!canAnimate || !animationConfig.lines.enabled) {
    return (
      <svg
        ref={containerRef}
        width={width}
        height={height}
        viewBox={viewBox}
        className={configClassName}
      >
        <defs>
          {configGradients.map((gradient) => (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              x1={gradient.x1}
              y1={gradient.y1}
              x2={gradient.x2}
              y2={gradient.y2}
            >
              {gradient.stops.map((stop, stopIndex) => (
                <stop
                  key={stopIndex}
                  offset={stop.offset}
                  stopColor={stop.stopColor}
                />
              ))}
            </linearGradient>
          ))}
        </defs>
        {configLines.map((line, index) => (
          <path
            key={index}
            d={line.d}
            stroke={`url(#${line.gradientId})`}
            style={defaultLineStyles}
          />
        ))}
      </svg>
    )
  }

  return (
    <svg
      ref={containerRef}
      width={width}
      height={height}
      viewBox={viewBox}
      className={configClassName}
    >
      <defs>
        {configGradients.map((gradient) => (
          <linearGradient
            key={gradient.id}
            id={gradient.id}
            x1={gradient.x1}
            y1={gradient.y1}
            x2={gradient.x2}
            y2={gradient.y2}
          >
            {gradient.stops.map((stop, stopIndex) => (
              <stop
                key={stopIndex}
                offset={stop.offset}
                stopColor={stop.stopColor}
              />
            ))}
          </linearGradient>
        ))}
      </defs>
      {configLines.map((line, index) => (
        <path
          key={index}
          ref={setPathRef(index)}
          d={line.d}
          stroke={`url(#${line.gradientId})`}
          style={defaultLineStyles}
        />
      ))}
    </svg>
  )
}
