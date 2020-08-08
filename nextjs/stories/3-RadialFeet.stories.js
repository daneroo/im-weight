import React from 'react'
// import { action } from '@storybook/addon-actions'

import RadialFeet from '../components/RadialFeet'

export default {
  title: 'RadialFeet',
  component: RadialFeet
}

export const Playground = () => {
  const width = 400
  const height = 400
  const values = [{ stamp: new Date().toISOString(), value: 100 }]
  const onDrag = ({ movement, last }) => {
    // action('dragged')(JSON.stringify({ movement, last }))
  }

  return (
    <div style={{ color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ height, width })}</h2>

      <div
        style={{
          border: '1px solid green',
          width,
          height
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
