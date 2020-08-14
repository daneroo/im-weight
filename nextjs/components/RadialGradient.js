
import React from 'react'
import { useTransition, animated } from 'react-spring'
import useTheme from './useTheme'

// use a transition group to show a gradient
// blend two gradient sizes with opacity
// because css cannot transition gradients
export default function RadialGradient ({ style, width = 400, big = false }) {
  const { theme: { colors: { primary, background } } } = useTheme()
  const transitions = useTransition(big, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  const wh = {
    width,
    height: width
  }

  const Grad = ({ style, percent }) => {
    return (
      <div
        style={{
          ...wh,
          backgroundImage: `radial-gradient(circle at center,${primary} 0% ,${background} ${percent}%)`
        }}
      />
    )
  }

  return (
    <div
      style={{
        ...style,
        ...wh
      }}
    >
      {transitions.map(({ item, key, props }) =>
        item
          ? <animated.div key={key} style={props}><Grad style={props} percent={70.7} /></animated.div>
          : <animated.div key={key} style={props}><Grad style={props} percent={30} /></animated.div>
      )}
    </div>
  )
}
