import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

// Not used any more, but the idea was good.
// - need to refactor constraints code
// - better delta for ul..lr constraints
// -lots of boundary cases..
export default function SpringSlider ({
  style,
  width = 100, // needed to normalize delta
  onDrag = ({ down, movement, first, last }) => {},
  onDelta = ({ delta, last }) => {},
  constrain = (movement) => [movement[0], 0]
}) {
  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { tension: 370 } // doubled default tension
  }))

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement, first, last }) => {
    onDrag({ down, movement, first, last })

    // return delta:[-1,1]
    const [x] = movement
    const delta = clipAbs1(x / width)
    onDelta({ delta, last })
    set({ xy: down ? constrain(movement) : [0, 0] })
  })

  // Bind it to a component
  return (
    <animated.div
      {...bind()}
      style={{
        ...style,
        transform: xy.interpolate((x, y) => `translate3d(${x}px, ${y}px, 0)`)
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          background: 'rgba(0,0,0,.2)',
          borderRadius: '50%',
          // border: '2px solid rgb(128, 128, 255)',
          border: '2px solid rgb(255, 255, 255)',
          cursor: '-webkit-grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* ← ↔⛢↔ → ↤ ↦ ⟻ ⟼ ☉ */}
        <span style={{
          color: 'white',
          fontSize: '20px',
          fontStyle: 'bold'
        }}
        >☉
        </span>
      </div>
    </animated.div>
  )
}

const clipAbs1 = (v) => Math.max(-1, Math.min(1, v))

const max1 = (x) => Math.min(1, x)
export const makeConstraints = (width, height) => {
  return {
    h: (movement) => [movement[0], 0],
    ll: (movement) => {
      // console.log(movement)
      const [x] = movement // x: 0 -> width
      const xN = (width - x) / width // 1->0
      if (xN < 0) return [0, 0]
      if (xN > 1) return [width, width]
      const rad = Math.acos(max1(xN)) // 0->pi/2
      const yN = -Math.sin(rad)
      const y = yN * width
      return [x, y]
    },
    ur: (movement) => {
      const [x] = movement // x: 0 -> -width
      const xN = -x / width // 0->1
      if (xN < 0) return [0, 0]
      if (xN > 1) return [-width, -width]
      const rad = Math.asin(max1(xN)) // 0->pi/1
      console.log(rad / Math.PI)
      const yN = (1 - Math.cos(rad))
      const y = yN * -width
      return [x, -y]
    },
    lr: (movement) => {
      const [x] = movement // x: 0 -> -width
      const xN = (width + x) / width // 1->0
      if (xN < 0) return [0, 0]
      if (xN > 1) return [-width, width]
      const rad = Math.acos(max1(xN)) // 0->pi/2
      const yN = -Math.sin(rad)
      const y = yN * width
      return [x, y]
    },
    ul: (movement) => {
      const [x] = movement // x: 0 -> -width
      const xN = x / width // 0->1
      if (xN < 0) return [0, 0]
      if (xN > 1) return [width, width]
      const rad = Math.asin(max1(xN)) // 0->pi/2
      console.log(rad / Math.PI)
      const yN = 1 - Math.cos(rad)
      const y = yN * width
      return [x, y]
    }
  }
}
