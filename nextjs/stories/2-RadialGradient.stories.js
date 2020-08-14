import React, { useState } from 'react'
import RadialGradient from '../components/RadialGradient'

export default {
  title: 'RadialGradient',
  component: RadialGradient
}

export const Playground = () => {
  const [big, setBig] = useState(false)
  const [width, setWidth] = useState(300)
  const [hiddenBottom, setHiddenBottom] = useState(true)
  const bottom = hiddenBottom ? -width / 2 : 0
  return (
    <div style={{ color: 'white', background: 'black', fontFamily: 'sans-serif' }}>
      <div>
        <label for='big'>big</label>
        <input type='checkbox' id='big' checked={big} onChange={e => { setBig(e.target.checked) }} />
      </div>
      <div>
        <label for='width'>width</label>
        <input
          type='range' id='width' name='width'
          min='200' max='400' step='100'
          value={width}
          onChange={e => { setWidth(Number(e.target.value)) }}
        />
      </div>
      <div>
        <label for='bottom'>hidden bottom</label>
        <input type='checkbox' id='big' checked={hiddenBottom} onChange={e => { setHiddenBottom(e.target.checked) }} />
      </div>
      <h2>{JSON.stringify({ big, width, bottom })}</h2>

      <div
        style={{
          border: '1px solid green',
          width,
          height: width,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <RadialGradient
          key={big}
          big={big}
          width={width}
          style={{ position: 'absolute', bottom }}
        />
      </div>

    </div>
  )
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
