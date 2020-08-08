import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

export default function PullRelease ({ onDrag }) {
  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { tension: 370 } // doubled default tension
  }))

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement, first, last }) => {
    onDrag({ down, movement, first, last })
    // set({ xy: down ? movement : [0, 0] })
    //  constrain to horizontal movement only
    set({ xy: down ? [movement[0], 0] : [0, 0] })
  })

  // Bind it to a component
  return (
    <animated.div
      {...bind()}
      style={{
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
        <span style={{
          color: 'white',
          fontSize: '20px',
          fontStyle: 'bold'
        }}
        >
        ⟻ ⟼
          {/* ← ↔⛢↔ → ↤ ↦ */}

        </span>
      </div>
    </animated.div>
  )
}
