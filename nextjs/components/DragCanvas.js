import React, { useState } from 'react'
import { useDrag } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring'
import useDimensions from 'react-use-dimensions'

// width: the Width of the control Surface
// big -> adding Observation
export default function DragCanvas ({ style, width, big, onZ }) {
  //  bug report: L10-11: https://github.com/Swizec/useDimensions/blob/master/src/index.ts
  const [ref, { x: left, y: top /* width,height */ }] = useDimensions()

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  const [z, setZ] = useState({
    down: false,
    movement: [0, 0],
    initial: [217, 316],
    distance: 0,
    direction: [0, 0]
  })

  const fromViewPort = ([x, y], { left, top }) => {
    return [x - left, y - top]
    // return [x - left, y - top - 330]
  }

  const bind = useDrag(({ down, movement, initial, xy }) => {
    const lt = { left, top }
    const zz = { down, movement, initial: fromViewPort(initial, lt), xy: fromViewPort(xy, lt) }
    if (onZ) {
      onZ(zz)
    }
    // console.log('---------------------------')
    console.log('left,top', JSON.stringify(lt))
    console.log('vprt.in', JSON.stringify(initial))
    console.log('vprt.xy', JSON.stringify(xy))
    // console.log('ls', JSON.stringify(lt))
    // console.log('comp', JSON.stringify(zz.initial))
    // console.log('svg:', JSON.stringify(toSVG(zz.initial)))
    setZ(zz)
    // set({ xy: down ? movement : [0, 0] })
    // console.log(JSON.stringify({ down, movement }))
    // set({ xy: [0, 0] })
  })
  const opa = 1
  const thick = 0.01
  const clr = 'rgba(255,255,255,.2)'

  const toSVG = ([x, y]) => {
    return [2 * x / width - 1, 1 - 2 * y / width]
  }

  const add = ([x1, y1], [x2, y2]) => {
    return [x1 + y1, x2 + y2]
  }

  const Dragging = () => {
    const dotClr = (z && z.down) ? 'red' : 'grey'
    if (z && z.down) {
      const initial = toSVG(z.initial)
      const xy = toSVG(z.xy)
      return (
        <g>
          <circle cx='0' cy='0' r={thick * 10} fill={dotClr} />
          <circle cx={initial[0]} cy={initial[1]} r={thick * 10} fill='green' />
          <circle cx={xy[0]} cy={xy[1]} r={thick * 10} fill='yellow' />
          <line x1={initial[0]} y1={initial[1]} x2={xy[0]} y2={xy[1]} stroke='gray' />
        </g>
      )
    }
    return (
      <circle cx='0' cy='0' r={thick * 10} fill={dotClr} />
    )
  }
  return (
    <div style={{
      ...style,
      // width: '100%',
      width,
      height: width
      // background: clr
    }}
    >
      <animated.div
        {...bind()}
        ref={ref}
        style={{
          transform: xy.interpolate((x, y) => `translate3d(${x}px, ${y}px, 0)`)
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='-1 -1 2 2'
        >
          <g transform='scale(1,-1)'>
            <g transform='scale(1)'>
              <rect x='-1' y='-1' width='2' height='2' fill='rgba(0,0,255,.1)' />
              <g
                fill='none'
                strokeWidth={thick}
                strokeDasharray={0.05}
                stroke={clr}
              >
                {!big && (
                  <polyline
                    points='-1,0 1,0'
                    opacity={opa}
                  />
                )}
                {big && (
                  <>
                    <circle cx='1' cy='-1' r='2' />
                    <circle cx='-1' cy='-1' r='2' />
                  </>
                )}
                <Dragging />
              </g>
            </g>
          </g>
        </svg>
      </animated.div>
    </div>
  )
}
