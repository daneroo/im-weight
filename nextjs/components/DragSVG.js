import React, { useState } from 'react'
import { useDrag } from 'react-use-gesture'
import { animated } from 'react-spring'
import useDimensions from 'react-use-dimensions'
import useTheme from './useTheme'

// This is relative to SVG scale:[-1,1]
const thick = 0.01

export const SimpleSlider = ({ style, onDrag, onDelta }) => {

  // This is where the transformations happen
  // - For outside interaction, we only provide onDelta({down,delta})
  // - For Drawing we provide svgState state variable
  // - Should call onDelta
  const augmentSVG = (svgSpc) => {
    const { last, down, movement } = svgSpc
    const magnitude = (down) ? Math.sqrt(movement[0] * movement[0] + movement[1] * movement[1]) / 2 : 0
    console.log({ magnitude })
    const delta = clipAbs1(magnitude)
    if (onDelta) {
      onDelta({ last, delta })
    }
    return { ...svgSpc, delta }
  }

  const { ref, svgState, bind } = useDragSVG(onDrag, augmentSVG)

  const { down, xy } = svgState

  const gradient = 'url("#whiteGradient")'

  return (
    <div style={style}>
      <animated.div {...bind()} ref={ref}>
        <SVGUnit>
          {/* the dashed x axis */}
          <g strokeDasharray={thick * 5}>
            <polyline points='-1,0 1,0' />
            <polyline points='0,-1 0,1' />
          </g>

          {down && (
            <g>
              {/* current drag position */}
              <circle cx={xy[0]} cy={xy[1]} r={thick * 40} stroke='none' fill={gradient} />
            </g>
          )}
        </SVGUnit>
      </animated.div>
    </div>
  )
}

export const AnchorZoom = ({ style, onDrag, onDelta }) => {
  const { theme: { colors: { primary } } } = useTheme()

  // This is where the transformations happen
  // - For outside interaction, we only provide onDelta({down,delta})
  // - For Drawing we provide svgState state variable
  // - Should call onDelta
  const augmentSVG = (svgSpc) => {
    const { last, down, movement } = svgSpc
    const delta = down ? clipAbs1(movement[0] / 2) : 0
    if (onDelta) {
      onDelta({ last, delta })
    }
    return { ...svgSpc, delta }
  }

  const { ref, svgState, bind } = useDragSVG(onDrag, augmentSVG)

  const { down, xy, delta } = svgState

  const freq = 3 + 2 * delta // freq: 1..5
  const gradient = 'url("#whiteGradient")'

  return (
    <div style={style}>
      <animated.div {...bind()} ref={ref}>
        <SVGUnit>
          {/* the dashed x axis */}
          <g strokeDasharray={thick * 5}>
            <polyline points='-1,0 1,0' />
          </g>

          {down && (
            <g>
              {/* current drag position */}
              <circle cx={xy[0]} cy={xy[1]} r={thick * 40} stroke='none' fill={gradient} />

              {/* The sine wave and style */}
              <g
                stroke={primary}
                // strokeDasharray={thick * 5}
                opacity={0.7}
                transform='translate(1,0) scale(-2,1)'
              >
                <Sine amplitude={0.5} freq={freq} />
              </g>
            </g>
          )}
        </SVGUnit>
      </animated.div>
    </div>
  )
}

export const ArcSlider = ({ style, onDrag, onDelta }) => {
  const { theme: { colors: { primary } } } = useTheme()

  // This is where the transformations happen
  // - For outside interaction, we only provide onDelta({down,delta})
  // - For Drawing we provide svgState state variable
  // - Should call onDelta
  const augmentSVG = (svgSpc) => {
    const { last, initial, xy } = svgSpc
    const corner = (initial[0] * initial[1] > 0)
      ? [1, -1] // right corner
      : [-1, -1] // left corner

    // angles go from 180..90 (right corner)
    // angles go from 0..90 (left corner)
    const angleI = Math.atan2(initial[1] - corner[1], initial[0] - corner[0])
    const angleXY = Math.atan2(xy[1] - corner[1], xy[0] - corner[0])
    const deltaA = (angleXY - angleI) / Math.PI
    // normalize(0-1) and flip for right corner
    const flip = (initial[0] * initial[1] > 0) ? -1 : 1
    const deltaArc = clipAbs1(flip * (angleXY - angleI) * 2 / Math.PI)

    if (onDelta) {
      onDelta({ last, delta: deltaArc })
    }
    return { ...svgSpc, deltaA, deltaArc, corner, angleI, angleXY }
  }

  const { ref, svgState, bind } = useDragSVG(onDrag, augmentSVG)

  const { down, xy } = svgState

  if (!down) {
    return (
      <div style={style}>
        <animated.div {...bind()} ref={ref}>
          <SVGUnit>
            <g strokeDasharray={thick * 5}>
              {/* two reference arcs */}
              <circle cx='1' cy='-1' r='2' />
              <circle cx='-1' cy='-1' r='2' />
            </g>
          </SVGUnit>
        </animated.div>
      </div>
    )
  }

  // Calculate local values

  const { deltaA, corner, angleI, angleXY } = svgState

  const gradient = 'url("#whiteGradient")'
  const largeArcFlag = 0
  const sweepFlag = (deltaA && deltaA > 0) ? 1 : 0
  // projected onto circle
  // const pI = [Math.cos(angleI) + corner[0], Math.sin(angleI) + corner[1]]
  const pI = add(scale([Math.cos(angleI), Math.sin(angleI)], [2, 2]), corner)
  const pXY = add(scale([Math.cos(angleXY), Math.sin(angleXY)], [2, 2]), corner)
  return (
    <div style={style}>
      <animated.div {...bind()} ref={ref}>
        <SVGUnit>

          <g strokeDasharray={thick * 5}>
            {/* two reference arcs */}
            <circle cx='1' cy='-1' r='2' />
            <circle cx='-1' cy='-1' r='2' />
          </g>

          {/* anchor for arc (corner) */}
          {/* <circle cx={corner[0]} cy={corner[1]} r={thick * 10} fill={text} /> */}

          {/* line from corner to current */}
          {/* <line x1={corner[0]} y1={corner[1]} x2={xy[0]} y2={xy[1]} stroke={text} strokeDasharray={thick * 5} /> */}

          <g>
            {/* drawn arc segment (not filled) */}
            <path
              d={`M ${pI[0]} ${pI[1]}
                    A 2 2 0 ${largeArcFlag} ${sweepFlag} ${pXY[0]} ${pXY[1]}
                `}
              fill='none' stroke={primary}
              markerEnd='url(#arrow)'
            />

            {/* filled in arc */}
            {/* <path
              d={`M ${corner[0]} ${corner[1]}
                  L ${pI[0]} ${pI[1]}
                  A 2 2 0 ${largeArcFlag} ${sweepFlag} ${pXY[0]} ${pXY[1]}
                  Z
               `}
              fill={primary}
              opacity={0.2}
              stroke='none'
            /> */}
          </g>

          {/* current drag position */}
          <circle cx={xy[0]} cy={xy[1]} r={thick * 40} stroke='none' fill={gradient} />
        </SVGUnit>
      </animated.div>
    </div>
  )
}

// <svg /> wrapper for
function SVGUnit ({ children }) {
  const { theme: { colors: { text, primary, secondary } } } = useTheme()

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 2 2'>
      <defs>
        <radialGradient id='whiteGradient'>
          <stop offset='0%' stopColor={secondary} />
          {/* <stop offset='50%' stopColor={secondary} /> */}
          <stop offset='100%' stopColor={secondary} stopOpacity={0.1} />
        </radialGradient>
        <marker
          id='arrow' viewBox='0 0 10 10'
          refX='1' refY='5'
          markerUnits='strokeWidth'
          markerWidth='10' markerHeight='10'
          orient='auto'
        >
          <path d='M 0 0 L 10 5 L 0 10 z' fill={primary} />
        </marker>
      </defs>
      <g transform='scale(1,-1)'>
        {/* default stroke color and thickness */}
        <g
          strokeWidth={thick}
          stroke={text}
          fill='none'
        >

          {/* show background rect */}
          {/* <rect x='-1' y='-1' width='2' height='2' fill={primary} opacity={0.1} /> */}

          {/* actual component content */}
          {children}
        </g>
      </g>
    </svg>
  )
}

// Transform viewport coordinates to svg ([-1,1]^2) coordinates
// - Requires injected useDimensions for width, height=width, but also top and left.
function viewportToSVG (dimensions, gesture) {
  // x/left,y/top: bug report: L10-11: https://github.com/Swizec/useDimensions/blob/master/src/index.ts
  const { x: left, y: top, width } = dimensions
  const { last, down, initial, xy, movement } = gesture

  const vp2svgScale = [2 / width, -2 / width]
  const vpToSvg = (xy) => {
    return add(scale(xy, vp2svgScale), [-1, 1])
  }
  return {
    last,
    down,
    initial: vpToSvg(add(initial, [-left, -top])),
    xy: vpToSvg(add(xy, [-left, -top])),
    movement: scale(movement, vp2svgScale) // no offset, just scale
  }
}

// Combine useDimensions, useState and useDrag
// - useDimensions used to map coordinates (width x height):-> -1,1 svg unit square
// - useDrag from react-use-gesture : gesture state: {last,down,initial,xy,movement,..}
// - Fire onDrag event with coordinate transformed coordinates
// - Augment the return object with augmentSVG(svgState)
//  - to make it available in the parent (calling) component
function useDragSVG (onDrag, augmentSVG) {
  const [ref, dimensions] = useDimensions()

  // event and coordinates in svg space, for use in Specialized Drawing components
  const [svgState, setSvgState] = useState({ })
  const bind = useDrag((gesture) => {
    const svg = viewportToSVG(dimensions, gesture)
    if (onDrag) {
      onDrag(svg)
    }
    const svgAug = augmentSVG(svg)
    setSvgState(svgAug)
  })
  return { ref, svgState, bind }
}

// generate a sine curve {x,a*sin(x*2PI/period) | x in 0,1}
function Sine ({ amplitude = 1, freq = 1 }) {
  const points = Array.from(Array(100), (_, i) => {
    const x = i / 100
    return [x, amplitude * Math.sin(freq * x * 2 * Math.PI)]
  }).map(([x, y]) => `${x},${y}`).join(' ')
  return <polyline points={points} />
}

const clipAbs1 = (v) => Math.max(-1, Math.min(1, v))

const scale = ([x, y], [a, b]) => {
  return [a * x, b * y]
}

const add = ([x1, y1], [x2, y2]) => {
  return [x1 + x2, y1 + y2]
}
