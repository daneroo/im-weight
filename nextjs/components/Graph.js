
import moment from 'moment'
import { ResponsiveLine } from '@nivo/line'
import { minmaxValuesRounded } from './minmaxValues'

export default function Graph ({ values, since, adjustZoom }) {
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
      text: 'rgb(128, 128, 128)',
      tickAndGrid: 'rgb(128, 128, 128)'
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
          fontSize: 18
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

  const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
    <g>
      <circle fill='#fff' r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
      <circle
        r={size / 5}
        strokeWidth={borderWidth}
        stroke={borderColor}
        fill={color}
        fillOpacity={0.35}
      />
    </g>
  )

  return (
    <>
      <ResponsiveLine
        {...commonProperties}
        theme={theme}
        data={nivoData}
        colors={['rgb(128, 128, 255)']}
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
          // legend: 'Weight',
          // legendOffset: 5
        }}
        curve='monotoneX'
        enablePoints={hasDots}
        // enablePointLabel
        pointSymbol={CustomSymbol}
        pointSize={8}
        pointBorderWidth={1}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        useMesh
        enableSlices={false}
      />

      <div style={{ position: 'fixed', top: 0 }}>
        <button onClick={() => adjustZoom(-1)}>-</button>
        {since}
        <button onClick={() => adjustZoom(+1)}>+</button>
      </div>
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
