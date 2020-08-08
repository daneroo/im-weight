
import { Transition } from 'react-transition-group'

const duration = 300

const zero = {
  opacity: 0
}
const one = {
  opacity: 1
}

const defaultStyle = {
  // transition: `opacity ${duration}ms ease-in-out`,
  transition: `opacity ${duration}ms linear`,
  ...zero
}

const transitionStyles = {
  entering: one,
  entered: one,
  exiting: zero,
  exited: zero
}

export default function RadialGradient ({ radius = 400, obsOn = false }) {
  return (
    <>
      <Transition in={obsOn} timeout={duration}>
        {state => (
          <div
            style={{
              zIndex: -2,
              position: 'absolute',
              bottom: `${-radius}px`,
              width: `${2 * radius}px`,
              height: `${2 * radius}px`,
              // background: 'blue',
              backgroundImage: 'radial-gradient(circle at center,rgb(128,128,255) 0% ,rgb(0,0,0) 60%)',
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          />
        )}
      </Transition>
      <Transition in={!obsOn} timeout={duration}>
        {state => (
          <div
            style={{
              zIndex: -2,
              position: 'absolute',
              bottom: `${-radius}px`,
              width: `${2 * radius}px`,
              height: `${2 * radius}px`,
              background: 'red',
              backgroundImage: 'radial-gradient(circle at center,rgb(128,128,255) 0% ,rgb(0,0,0) 20%)',
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          />
        )}
      </Transition>
    </>

  )
}
