import React, { useState } from 'react'
import RadialGradient from '../components/RadialGradient'
import HideBottom from '../components/HideBottom'

export default {
  title: 'RadialGradient',
  component: RadialGradient
}

export const Small = () => <RadialGradient big={false} />

export const Big = () => <RadialGradient big />

export const Combos = () => {
  return (
    <div style={{
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}
    >
      {[200, 400].map(width => {
        return [false, true].map((big) => {
          const variant = { width, big }
          return (
            <>
              <h2>{JSON.stringify(variant)}</h2>
              <RadialGradient key={big} {...variant} />
            </>
          )
        })
      })}
    </div>
  )
}

export const Playground = () => {
  const [big, setBig] = useState(false)
  const [width, setWidth] = useState(300)
  const [bottom, setBottom] = useState(-150)
  return (
    <div style={{ color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <label for='big'>big</label>
      <input type='checkbox' id='big' checked={big} onChange={e => { setBig(e.target.checked) }} />
      <label for='width'>width</label>
      <input
        type='range' id='width' name='width'
        min='200' max='400' step='100'
        value={width}
        onChange={e => { setWidth(Number(e.target.value)) }}
      />
      <label for='bottom'>hidden bottom</label>
      <input
        type='range' id='bottom' name='bottom'
        min='-400' max='400' step='50'
        value={bottom}
        onChange={e => { setBottom(Number(e.target.value)) }}
      />
      <h2>{JSON.stringify({ big, width, bottom })}</h2>

      <HideBottom
        style={{
          border: '1px solid green',
          width,
          height: width
        }}
      >
        <RadialGradient
          key={big}
          big={big}
          width={width}
          style={{ bottom }}
        />
      </HideBottom>

    </div>
  )
}
