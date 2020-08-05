import React, { useState } from 'react'
import moment from 'moment'
import { minmaxValues } from './minmaxValues'

// We only pass in values.length>0
export default function ValueForRange ({ values }) {
  const [bylineIndex, setBylineIndex] = useState(0)

  const { stamp, value } = values[0] // latest value
  const { min, max } = minmaxValues(values)
  const since = moment(values.slice(-1)[0].stamp).fromNow(true) // without ago

  const bylines = [
    moment(stamp).fromNow(), // when was the last sample (relative)
    moment(stamp).format('YYYY-MM-DD HH:mm'), // when was the last sample (absolute)
    `${Number(min).toFixed(1)} - ${Number(max.toFixed(1))} over ${since}`
  ]

  const rotateByline = () => setBylineIndex((bylineIndex + 1) % bylines.length)

  const byline = bylines[bylineIndex]

  return (
    <div
      onClick={rotateByline}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{
        color: 'rgb(64,64,255)',
        fontSize: '3rem',
        lineHeight: 1.2,
        fontWeight: 600

      }}
      >{Number(value).toFixed(1)}
      </div>
      <div style={{ fontStyle: 'italic' }}>
        {byline}
      </div>

    </div>
  )
}
