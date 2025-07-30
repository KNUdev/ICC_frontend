'use client'
import {
  useFormLinesAnimation,
  type FormLineConfig,
} from '@/common/animations/FormLines/FormLinesAnimation'
import {
  useAnimatedLines,
  type GradientConfig,
  type LineConfig,
} from '@/shared/hooks/useAnimatedLines'
import { memo, useMemo } from 'react'

interface BaseAnimatedLinesProps {
  gradients: GradientConfig[]
  className?: string
}

interface RandomAnimatedLinesProps extends BaseAnimatedLinesProps {
  mode: 'random'
  lines: LineConfig[]
  baseDuration?: number
  durationVariation?: number
  easing?: string
  forceDisable?: boolean
}

interface SynchronizedAnimatedLinesProps extends BaseAnimatedLinesProps {
  mode: 'synchronized'
  lines: FormLineConfig[]
  mainLineDuration?: number
  sideLineDuration?: number
  cycleDuration?: number
  forceDisable?: boolean
}

type AnimatedLinesProps =
  | RandomAnimatedLinesProps
  | SynchronizedAnimatedLinesProps

const GradientDefs = memo(({ gradients }: { gradients: GradientConfig[] }) => {
  const memoizedGradients = useMemo(() => gradients, [gradients])

  return (
    <defs>
      {memoizedGradients.map((gradient) => (
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
  )
})
GradientDefs.displayName = 'GradientDefs'

const AnimatedLine = memo(
  ({
    line,
    index,
    setPathRef,
    defaultLineStyles,
    className,
    mode,
  }: {
    line: LineConfig | FormLineConfig
    index: number
    setPathRef: (index: number) => (ref: SVGPathElement | null) => void
    defaultLineStyles: React.CSSProperties
    className?: string
    mode: 'random' | 'synchronized'
  }) => {
    const backgroundLineStyles = useMemo(
      () => ({
        ...defaultLineStyles,
        strokeOpacity: 0.2,
      }),
      [defaultLineStyles],
    )

    const lineKey = useMemo(() => {
      if (mode === 'synchronized') {
        const formLine = line as FormLineConfig
        return `${formLine.gradientId}-${index}-${formLine.isMainLine}`
      }
      return `${line.gradientId}-${index}`
    }, [line, index, mode])

    return (
      <g key={lineKey}>
        <path
          d={line.d}
          stroke={`url(#${line.gradientId})`}
          style={backgroundLineStyles}
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
    )
  },
)
AnimatedLine.displayName = 'AnimatedLine'

const RandomAnimatedLines = memo(function RandomAnimatedLines(
  props: RandomAnimatedLinesProps,
) {
  const { setPathRef, lines, gradients, defaultLineStyles, className } =
    useAnimatedLines({
      lines: props.lines,
      gradients: props.gradients,
      baseDuration: props.baseDuration,
      durationVariation: props.durationVariation,
      easing: props.easing,
      className: props.className,
      forceDisable: props.forceDisable,
    })

  const memoizedLines = useMemo(
    () =>
      lines.map((line, index) => (
        <AnimatedLine
          key={`${line.gradientId}-${index}`}
          line={line}
          index={index}
          setPathRef={setPathRef}
          defaultLineStyles={defaultLineStyles}
          className={className}
          mode='random'
        />
      )),
    [lines, setPathRef, defaultLineStyles, className],
  )

  return (
    <>
      <GradientDefs gradients={gradients} />
      {memoizedLines}
    </>
  )
})

const SynchronizedAnimatedLines = memo(function SynchronizedAnimatedLines(
  props: SynchronizedAnimatedLinesProps,
) {
  const { setPathRef, lines, gradients, defaultLineStyles, className } =
    useFormLinesAnimation({
      lines: props.lines,
      gradients: props.gradients,
      mainLineDuration: props.mainLineDuration,
      sideLineDuration: props.sideLineDuration,
      cycleDuration: props.cycleDuration,
      className: props.className,
      forceDisable: props.forceDisable,
    })

  const memoizedLines = useMemo(
    () =>
      lines.map((line, index) => (
        <AnimatedLine
          key={`${line.gradientId}-${index}-${line.isMainLine}`}
          line={line}
          index={index}
          setPathRef={setPathRef}
          defaultLineStyles={defaultLineStyles}
          className={className}
          mode='synchronized'
        />
      )),
    [lines, setPathRef, defaultLineStyles, className],
  )

  return (
    <>
      <GradientDefs gradients={gradients} />
      {memoizedLines}
    </>
  )
})

export const AnimatedLines = memo(function AnimatedLines(
  props: AnimatedLinesProps,
) {
  if (props.mode === 'random') {
    return <RandomAnimatedLines {...props} />
  } else {
    return <SynchronizedAnimatedLines {...props} />
  }
})

export type {
  AnimatedLinesProps,
  RandomAnimatedLinesProps,
  SynchronizedAnimatedLinesProps,
}
