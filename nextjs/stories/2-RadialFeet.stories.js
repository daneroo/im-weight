import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'

import RadialFeet from '../components/RadialFeet'

export default {
  title: 'RadialFeet',
  component: RadialFeet
}

export const Playground = () => {
  const [big, setBig] = useState(false)
  const width = 300
  const onClick = ({ big }) => {
    setBig(big)
    action('clicked')()
  }
  return (
    <div style={{ color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <h2>{JSON.stringify({ big, width })}</h2>

      <div
        style={{
          width,
          height: width
        }}
      >
        <RadialFeet
          width={width}
          onClick={onClick}
        />
      </div>

    </div>
  )
}
