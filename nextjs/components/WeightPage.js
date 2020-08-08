import React, { useState, useMemo } from 'react'
import moment from 'moment'
import useSWR from 'swr'
import useDimensions from 'react-use-dimensions'
import fetcher from './fetcher'

import Graph from './Graph'
import RadialFeet from './RadialFeet'

const zoomMonths = [3, 6, 12, 24, 36, 60, 999]

// TODO(daneroo) move this scale and filter stuff into own module
const scale = ({ stamp, value }) => ({ stamp, value: value / 1000 })

// This is actually fast enough now that memoization is not necessary
// returns an array: zoomIndex -> {values,since}

function memoizeDataByZoom (data) {
  if (!data || !data.values) return []

  // scale the data only once - filter for every zoom
  const scaled = data.values.map(scale)

  // produce [{values,since}] for every zoom(months)
  return zoomMonths.map((zoom) => {
    const sinceMoment = moment().subtract(zoom, 'months')
    const sinceUTCString = sinceMoment.utc().format()
    // use UTC string compare
    // 100x slower: comparing with moment(stamp).isAfter(sinceMoment)
    const filterSince = ({ stamp, value }) => stamp > sinceUTCString

    // values: scaled and filtered for current time range [{stamp,value}]
    const filtered = scaled.filter(filterSince)

    if (filtered.length === 0) {
      return {
        since: moment(sinceUTCString).fromNow(true),
        values: [{ stamp: new Date().toISOString(), value: 100 }]
      }
    }
    // this is the displayed value (3 months,...12 years)
    const since = moment(filtered.slice(-1)[0].stamp).fromNow(true)
    return { values: filtered, since }
  })
}

export default function WeightPage () {
  // width for relative drag in PullRelease
  const [ref, { width, height }] = useDimensions()
  // dimensions for graph
  const [refGraph, { width: widthGraph, height: heightGraph }] = useDimensions()
  const [zoom, setZoom] = useState(0)
  const [zoomReference, setZoomReference] = useState(zoom)
  const { data, error } = useSWR('/api/backup', fetcher)
  const dataByZoom = useMemo(() => memoizeDataByZoom(data), [data])

  // TODO(daneroo): better loading/error positioning and rendering?
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (!data.values || data.values.length === 0) return <div>no data...</div>

  // console.log(dataByZoom.map(z => z.since))
  const { values, since } = dataByZoom[zoom]

  if (values.length === 0) return <div>no data...</div>

  const adjustZoom = (delta) => {
    setZoom((zoom + delta + zoomMonths.length) % zoomMonths.length)
  }

  // delta is relative to zoomReference
  const setSafeZoom = (delta) => {
    const nuZoom = Math.floor(zoomReference + delta)
    // console.log(nuZoom, zoomReference)
    if (zoom !== nuZoom && nuZoom >= 0 && nuZoom < zoomMonths.length) {
      setZoom(nuZoom)
    }
  }

  // This is the constrained movement from PullRelease
  const onDrag = ({ movement, last }) => {
    const [x] = movement
    // step is [-7,+7] // while we are dragging
    const delta = x * 14 / width
    setSafeZoom(delta)
    if (last) {
      setZoomReference(zoom)
    }
  }

  const border = { border: '1px solid orange' }
  return (
    <div
      // ref={ref}
      style={{
        overflow: 'hidden'
      }}
    >
      {/* now using useDimensions to inject w/h for Canvas */}
      <section
        ref={refGraph}
        style={{
          ...border,
          width: '100%',
          height: '40vh',
          position: 'fixed',
          top: 0
        }}
      >
        <Graph values={values} since={since} adjustZoom={adjustZoom} width={widthGraph} height={heightGraph} />
      </section>

      <section
        ref={ref}
        style={{
          ...border,
          width: '100%',
          height: '50vh',
          position: 'fixed',
          bottom: 0
        }}
      >
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'space-between',
          alignItems: 'center'
        }}
        >

          <footer
            style={{
              border: '1px solid red',
              flexGrow: 1,
              width,
              height,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <RadialFeet
              width={400}
              height={height}
              values={values}
              onDrag={onDrag}
            />

          </footer>

        </div>
      </section>

    </div>
  )
}
