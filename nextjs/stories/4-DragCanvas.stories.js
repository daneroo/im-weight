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
  // const stamp = new Date().toISOString()
  // const [values, setValues] = useState([{ stamp, value: 100 }])
  const [z, setZ] = useState({
    down: false // ...
  })
  const zz = { ...z }
  delete zz.viewport
  // params {delta }
  const onZ = (zz) => {
    setZ(zz)
  }
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
            onZ={onZ}
            big={!isZoom}
          />
        </div>
        <pre style={{ fontSize: 14 }}>{JSON.stringify(zz, null, 2)}</pre>
      </div>
    </div>
  )
}
