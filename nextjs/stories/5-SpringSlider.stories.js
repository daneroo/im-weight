import React, { useState } from 'react'
// import { action } from '@storybook/addon-actions'

import PullRelease, { makeConstraints } from '../components/PullRelease'

export default {
  title: 'SpringSlider (not used)',
  component: PullRelease
}

const onDrag = () => {}
export const Playground = () => {
  const width = 300
  const height = 300
  const [gestureState, setGestureState] = useState({ down: false, movement: [0, 0], first: false, last: true })
  const [deltaState, setDeltaState] = useState({ delta: 0, last: true })
  const constraints = makeConstraints(width, height)
  const onDrag = (gs) => {
    setGestureState(gs)
  }
  const onDelta = (ds) => {
    setDeltaState(ds)
  }
  return (
    <div style={{ height: '100%', color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>
      <div>PullRelease need to be renames SpringSlider...</div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{
          width,
          height,
          margin: 100,
          position: 'relative',
          border: '1px solid green'
        }}
        >
          <PullRelease
            width={width}
            style={{ position: 'absolute', top: ((height || 100) - 64) / 2, left: ((width || 100) - 64) / 2 }}
            onDrag={onDrag}
            onDelta={onDelta}
          />

          <PullRelease
            width={width}
            style={{ position: 'absolute', bottom: width - 32, left: -32 }}
            constrain={constraints.ul}
            onDrag={onDrag}
            onDelta={onDelta}
          />
          <PullRelease
            width={width}
            style={{ position: 'absolute', bottom: width - 32, right: -32 }}
            constrain={constraints.ur}
            onDrag={onDrag}
            onDelta={onDelta}
          />
          <PullRelease
            width={width}
            style={{ position: 'absolute', bottom: -32, left: -32 }}
            constrain={constraints.ll}
            onDrag={onDrag}
            onDelta={onDelta}
          />
          <PullRelease
            width={width}
            style={{ position: 'absolute', bottom: -32, right: -32 }}
            constrain={constraints.lr}
            onDrag={onDrag}
            onDelta={onDelta}
          />

        </div>
        <div>
          <pre style={{ margin: 50 }}>{JSON.stringify(deltaState, null, 2)}</pre>
          <pre style={{ margin: 50 }}>{JSON.stringify(gestureState, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
