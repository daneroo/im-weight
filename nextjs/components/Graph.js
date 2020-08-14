
import moment from 'moment'

// Now that width/height are injected, we can use Canvas or SVG
// import { Line } from '@nivo/line'
import { LineCanvas as Line } from '@nivo/line'

import { minmaxValuesRounded } from './minmaxValues'
import useTheme from './useTheme'

export default function Graph ({ values, since, adjustZoom, width, height }) {
  const { theme: { colors: { text, primary, secondary } } } = useTheme()
  // guard against undefined w,h
  if (!width || !height) return <></>

  // important params: hasDots => enablePoints
  const hasDots = values.length < 75

  // adjust time range: min/max
  const xScale = {
    min: values.slice(-1)[0].stamp, // could round this off (floor)
    max: new Date().toISOString() // use `now`, not latest sample
  }

  // const yScale = { min: 'auto', max: 'auto' }
  const yScale = minmaxValuesRounded(values)

  // set up time axis labels - all we need is min/max
  const xTicks = timeTicks(xScale)

  const myTheme = {
    color: {
      text: text,
      point: secondary,
      tickAndGrid: text,
      line: primary
    }
  }

  // ----------------------------
  // That should be all for tuning.

  // nivo needs {x,y} pars
  const nivoData = [{
    id: 'line', // needed for legends
    data: values.map((o, i) => {
      return { x: o.stamp, y: o.value }
    })
  }]

  const commonProperties = {
    width,
    height,
    // add margin for axis labels
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
    animate: true
    // enableSlices: 'x'
  }

  // see https://github.com/plouc/nivo/blob/master/packages/core/src/theming/defaultTheme.js
  const theme = {
    background: 'transparent',
    // fontFamily: 'sans-serif',
    fontSize: 14,
    textColor: myTheme.color.text,
    axis: {
      ticks: {
        line: {
          stroke: myTheme.color.tickAndGrid,
          strokeWidth: 0.7
        }
      },
      legend: {
        text: {
          fontSize: 18,
          color: 'red'
        }
      }
    },
    grid: {
      line: {
        stroke: myTheme.color.tickAndGrid,
        strokeWidth: 0.7
      }
    }
  }

  return (
    <>
      <Line
        {...commonProperties}
        theme={theme}
        data={nivoData}
        colors={[myTheme.color.line]}
        xScale={{
          type: 'time',
          format: '%Y-%m-%dT%H:%M:%S.%LZ',
          ...xScale, // min,max
          useUTC: false,
          precision: 'day'
        }}
        xFormat='time:%Y-%m-%d'
        yScale={{
          type: 'linear',
          ...yScale // min/max
        }}
        // enableGridX={false}
        // enableGridY={false}
        axisTop={{
          tickValues: 0,
          legendPosition: 'middle',
          legend: since,
          legendOffset: 5
        }}
        axisBottom={{
          ...xTicks, // format and tickValues
          tickSize: 10
          // tickRotation: -45
          // legend: 'Time',
          // legendOffset: -12
        }}
        axisLeft={{
          tickValues: 5
          // legend: 'lbs',
          // legendOffset: 5
        }}
        curve='monotoneX'
        enablePoints={hasDots}
        pointSize={8}
        pointColor={myTheme.color.point}
        useMesh
        enableSlices={false}
      />
    </>

  )
}

// separate out xAxis ticks logic
function timeTicks ({ min, max }) {
  const minMoment = moment(min)
  const maxMoment = moment(max)
  const daysInRange = maxMoment.diff(minMoment, 'days')

  if (daysInRange < 180) { // up to six labels
    return {
      format: '%b',
      tickValues: 'every 1 months'
    }
  }
  if (daysInRange < 730) { // up to 4 labels
    return {
      format: '%b \'%y',
      tickValues: 'every 6 months'
    }
  }

  // else find period which makes a max of 5 yearly labels.
  const desiredLabels = 5
  const periodYears = Math.ceil(daysInRange / 365 / desiredLabels)

  return {
    format: '%Y',
    tickValues: `every ${periodYears} years`
  }
}
