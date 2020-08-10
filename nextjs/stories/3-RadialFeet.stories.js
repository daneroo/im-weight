import React, { useState } from 'react'
// import { action } from '@storybook/addon-actions'

import RadialFeet from '../components/RadialFeet'

export default {
  title: 'RadialFeet',
  component: RadialFeet
}

export const Playground = () => {
  const width = 400
  const height = 500

  const stamp = new Date().toISOString()
  const [values, setValues] = useState([{ stamp, value: 100 }])

  const onDrag = ({ movement, last }) => {
    setValues([{ stamp, value: movement[0] }])
    // action('dragged')(JSON.stringify({ movement, last }))
  }

  return (
    <div style={{ height: 600, color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>

      <div
        style={{
          border: '1px solid green',
          width,
          height,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <RadialFeet
          width={400}
          height={height}
          values={values}
          onDrag={onDrag}
        />
      </div>

    </div>
  )
}
