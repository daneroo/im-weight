import React, { useState } from 'react'
// import { action } from '@storybook/addon-actions'

import { AnchorZoom, ArcSlider, SimpleSlider } from '../components/DragSVG'

export default {
  title: 'DragSVG'
  // component: AnchorZoom
}

function useDragAndDelta () {
  const [deltaState, setDeltaState] = useState({ delta: 0, last: true })
  const [gestureState, setGestureState] = useState({ down: false, movement: [0, 0], first: false, last: true })
  const onDelta = (ds) => setDeltaState(ds)
  const onDrag = (gs) => setGestureState(gs)
  // const onDelta = (ds) => {} // console.log(ds)
  // const onDrag = (gs) => {} // console.log(gs)
  return { deltaState, onDelta, gestureState, onDrag }
}

export const SimpleSlider1 = () => {
  const width = 300
  const height = 300
  const { deltaState, onDelta, gestureState, onDrag } = useDragAndDelta()
  return (
    <div style={{ height: 500, color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            border: '1px solid green',
            width,
            height: height + 50
          // display: 'relative'
          }}
        >
          <SimpleSlider
            style={{ overflow: 'hidden' }}
            onDelta={onDelta}
            onDrag={onDrag}
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

export const AnchorZoom1 = () => {
  const width = 300
  const height = 300
  const { deltaState, onDelta, gestureState, onDrag } = useDragAndDelta()
  return (
    <div style={{ height: 500, color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            border: '1px solid green',
            width,
            height: height + 50
          // display: 'relative'
          }}
        >
          <AnchorZoom
            style={{ overflow: 'hidden' }}
            onDelta={onDelta}
            onDrag={onDrag}
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

export const ArcSlider1 = () => {
  const width = 300
  const height = 300
  const { deltaState, onDelta, gestureState, onDrag } = useDragAndDelta()
  return (
    <div style={{ height: 500, color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            border: '1px solid green',
            width,
            height: height + 50
          // display: 'relative'
          }}
        >
          <ArcSlider
            style={{ overflow: 'hidden' }}
            onDelta={onDelta}
            onDrag={onDrag}
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

export const Playground = () => {
  const width = 300
  const height = 300
  const [isZoom, setZoom] = useState(true)
  const { deltaState, onDelta, gestureState, onDrag } = useDragAndDelta()

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
            height
          // display: 'relative'
          }}
        >
          {/* <DragSVG */}
          {isZoom && (
            <AnchorZoom
              style={{ overflow: 'hidden' }}
              onDelta={onDelta}
              onDrag={onDrag}
            />
          )}

          {!isZoom && (
            <ArcSlider
              style={{ overflow: 'hidden', width, height }}
              onDelta={onDelta}
              onDrag={onDrag}
            />
          )}
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
