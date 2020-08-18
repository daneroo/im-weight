import React, { useMemo } from 'react'
import moment from 'moment'
import useDimensions from 'react-use-dimensions'
import { get, add } from './useStorage'
import Graph from './Graph'
import ControlPanel from './ControlPanel'
import useDeltaDrag from './useDeltaDrag'

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
  const [ref, { height }] = useDimensions()
  // dimensions for graph
  const [refGraph, { width: widthGraph, height: heightGraph }] = useDimensions()

  const adjustAnchorZoomDelta = ({ delta, referenceValue }) => {
    // scale delta and round to [0..zoomMonths.length)
    const scale = 7
    const value = Math.min(zoomMonths.length - 1, Math.max(0, Math.floor(delta * scale + referenceValue)))
    return value
  }
  const [anchorZoomValue, updateDragAnchorZoom] = useDeltaDrag(0, adjustAnchorZoomDelta)

  // Get data: invoke useSWR()
  const { data, error } = get()

  const dataByZoom = useMemo(() => memoizeDataByZoom(data), [data])

  // TODO(daneroo): better loading/error positioning and rendering?
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (!data.values || data.values.length === 0) return <div>no data...</div>

  const { values, since } = dataByZoom[anchorZoomValue]

  if (values.length === 0) return <div>no data...</div>

  const border = { border: '0px solid orange' }
  return (
    <div
      // ref={ref}
      style={{
        overflow: 'hidden' // why?
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
        <Graph values={values} since={since} width={widthGraph} height={heightGraph} />
      </section>

      <section
        ref={ref}
        style={{
          ...border,
          width: '100%',
          height: '50vh',
          position: 'fixed',
          bottom: 0,
          //  for the children's layout: I just need to center?
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <ControlPanel
          width={400}
          height={height}
          values={values}
          onDeltaAnchorZoom={updateDragAnchorZoom}
          add={add}
        />

      </section>

    </div>
  )
}
