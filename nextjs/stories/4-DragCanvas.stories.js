import React, { useState } from 'react'
// import { action } from '@storybook/addon-actions'

import DragCanvas from '../components/DragCanvas'

export default {
  title: 'DragCanvas',
  component: DragCanvas
}

export const Playground = () => {
  const width = 400
  const height = 500

  const stamp = new Date().toISOString()
  const [values, setValues] = useState([{ stamp, value: 100 }])
  const [z, setZ] = useState({
    down: false,
    movement: [0, 0],
    initial: [217, 316],
    distance: 0,
    direction: [0, 0]
  })

  // params {delta }
  const onZ = (zz) => {
    setZ(zz)
  }

  return (
    <div style={{ height: 600, color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>
      <pre style={{ fontSize: 14 }}>{JSON.stringify(z)}</pre>

      <div style={{
        // position: 'fixed', bottom: 0
      }}
      >

        <div
          style={{
          // border: '1px solid green',
            width,
            height: height + 200
            // display: 'relative'
          }}
        >
          <div style={{
            // display: 'absolute', bottom: 0
          }}
          >
            <DragCanvas
              style={{ position: 'fixed', bottom: 0 }}
              width={400}
              height={height}
              onZ={onZ}
              big
            />
          </div>
        </div>
      </div>

    </div>
  )
}
