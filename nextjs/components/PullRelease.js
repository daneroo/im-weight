import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

export default function PullRelease () {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement }) => {
    set({ xy: down ? movement : [0, 0] })
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
          background: 'rgba(0,0,0,0.2)',
          backgroundImage: 'url(\'/images/twofeet-white.png\')',
          backgroundSize: 'cover',
          borderRadius: '40%',
          // border: '4px solid rgb(128, 128, 255)',
          border: '4px solid rgb(64, 64, 255)',
          cursor: '-webkit-grab',
          display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          color: 'white',
          whiteSpace: 'pre'
        }}
      />
    </animated.div>
  )
}
