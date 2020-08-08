
import { useTransition, animated } from 'react-spring'

// use a transition group to show a gradient
export default function RadialGradient ({ width = 400, obsOn = false }) {
  const transitions = useTransition(obsOn, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const grad = (percent, item, key) => {
    console.log({ item, key })
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${width}px`,
          // background: 'blue',
          backgroundImage: `radial-gradient(circle at center,rgb(128,128,255) 0% ,rgb(0,0,0) ${percent}%)`
        }}
      />
    )
  }

  return (
    <div
      style={{
        zIndex: -2,
        border: '1px solid red',
        position: 'absolute',
        bottom: `${-width / 2}px`,
        width: `${width}px`,
        height: `${width}px`
      }}
    >
      {transitions.map(({ item, key, props }) =>
        item
          ? <animated.div style={props}>{grad(70.7, item, key)}</animated.div>
          : <animated.div style={props}>{grad(20, item, key)}</animated.div>
      )}
    </div>
  )
}
