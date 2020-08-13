import React, { useState } from 'react'
// import { action } from '@storybook/addon-actions'

import DragCanvas from '../components/DragCanvas'

export default {
  title: 'DragCanvas',
  component: DragCanvas
}

export const Playground = () => {
  const width = 300
  const height = 350
  const [isZoom, setZoom] = useState(true)
  const [deltaState, setDeltaState] = useState({ delta: 0, last: true })

  const [gestureState, setGestureState] = useState({ down: false, movement: [0, 0], first: false, last: true })
  const onDelta = (ds) => setDeltaState(ds)
  const onDrag = (gs) => setGestureState(gs)

  const selectZoomOrSlide = (e) => {
    setZoom(e.target.value === 'AnchorZoom')
  }
  return (
    <div style={{ height: 500, color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>
      <div>
        <input checked={isZoom} type='radio' id='AnchorZoom' name='ZoomOrSlide' value='AnchorZoom' onChange={selectZoomOrSlide} />
        <label for='AnchorZoom'>AnchorZoom</label>
        <input checked={!isZoom} type='radio' id='ArcSlider' name='ZoomOrSlide' value='ArcSlider' onChange={selectZoomOrSlide} />
        <label for='ArcSlider'>ArcSlider</label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            border: '1px solid green',
            width,
            height: height
          // display: 'relative'
          }}
        >
          <DragCanvas
            style={{ overflow: 'hidden', width, height }}
            width={width}
            height={height}
            onDelta={onDelta}
            onDrag={onDrag}
            big={!isZoom}
          />
        </div>
        <div>
          <pre style={{ margin: 50 }}>
            onDelta: {JSON.stringify(deltaState, null, 2)}
          </pre>
          <pre style={{ margin: 50 }}>
            onDrag: {JSON.stringify(gestureState, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
