
import moment from 'moment'
import { ResponsiveLine } from '@nivo/line'

// TODO(daneroo): take data out of here...
export default function Graph ({ values, since, adjustZoom }) {
  console.log(since, values.length)
  const hasDots = values.length < 75

  const xTicks = {
    // default
    format: '%Y',
    tickValues: 'every 2 years',
    ...((values.length < 100) ? {
      format: '%Y',
      tickValues: 'every 1 years'
    } : {}),
    ...((values.length < 50) ? {
      format: '%Y',
      tickValues: 'every 1 years'
    } : {}),
    ...((values.length <= 35) ? {
      format: '%b \'%y',
      tickValues: 'every 6 months'
    } : {}),
    ...((values.length <= 20) ? { // 6months
      format: '%b',
      tickValues: 'every 1 months'
    } : {})

    // format: '%b \'%y',
    // tickValues: 'every 2 days',
    // tickValues: 'every 6 months',
    // tickValues: 'every 1 months'

  }

  // nivo needs {x,y} pars
  const nivoData = [{
    id: 'line',
    color: 'rgb(128, 128, 255)',
    data: values.map((o, i) => {
      return { x: o.stamp, y: o.value }
    })
  }]

  const commonProperties = {
    // add margin for axis labels
    margin: { top: 20, right: 20, bottom: 40, left: 60 },
    animate: true,
    enableSlices: 'x'
  }

  const theme = {
    background: 'transparent',
    // fontFamily: 'sans-serif',
    fontSize: 14,
    textColor: 'rgb(128, 128, 128)',
    axis: {
      domain: {
        line: {
          stroke: 'transparent',
          strokeWidth: 1
        }
      },
      ticks: {
        line: {
          stroke: 'rgb(128, 128, 128)',
          strokeWidth: 0.7
        },
        text: {}
      },
      legend: {
        text: {
          fontSize: 12
        }
      }
    },
    grid: {
      line: {
        stroke: 'rgb(128, 128, 128)',
        strokeWidth: 0.7
      }
    }

  }

  // const curveOptions = ['linear', 'monotoneX', 'step', 'stepBefore', 'stepAfter']

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
        // data={timeExampleData}
        data={nivoData}
        colors={['rgb(128, 128, 255)']}
        xScale={{
          type: 'time',
          format: '%Y-%m-%dT%H:%M:%S.%LZ',
          useUTC: false,
          precision: 'day'
        }}
        xFormat='time:%Y-%m-%d'
        yScale={{
          type: 'linear',
          stacked: false,
          min: 'auto',
          max: 'auto'
        }}
        axisLeft={{
          color: 'red',
          tickValues: 5
        // legend: 'Weight',
        // legendOffset: 5
        }}
        // enableGridX={false}
        // enableGridY={false}
        axisBottom={{
          format: xTicks.format,
          tickValues: xTicks.tickValues,
          tickSize: 10
        // legend: 'time scale',
        // legendOffset: -12
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

        // before

      // axisBottom={{
      //   orient: 'bottom',
      //   // tickSize: 5,
      //   // tickPadding: 5,
      //   tickRotation: -45
      //   // legend: 'transportation',
      //   // legendOffset: 36,
      //   // legendPosition: 'middle'
      // }}
      // axisLeft={{
      //   orient: 'left',
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0
      //   // legend: 'count',
      //   // legendOffset: -40,
      //   // legendPosition: 'middle'
      // }}
      // colors={{ scheme: 'spectral' }}
      // pointSize={10}
      // pointColor={{ theme: 'grid.line.stroke' }}
      // pointBorderWidth={2}
      // pointBorderColor={{ from: 'serieColor' }}
      // pointLabel='y'
      // pointLabelYOffset={-12}
      // useMesh
      // legends={[
      //   {
      //     anchor: 'bottom-right',
      //     direction: 'column',
      //     justify: false,
      //     translateX: 100,
      //     translateY: 0,
      //     itemsSpacing: 0,
      //     itemDirection: 'left-to-right',
      //     itemWidth: 80,
      //     itemHeight: 20,
      //     itemOpacity: 0.75,
      //     symbolSize: 12,
      //     symbolShape: 'circle',
      //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
      //     effects: [
      //       {
      //         on: 'hover',
      //         style: {
      //           itemBackground: 'rgba(0, 0, 0, .03)',
      //           itemOpacity: 1
      //         }
      //       }
      //     ]
      //   }
      // ]}
      />

      <div style={{ position: 'fixed', top: 0 }}>
        <button onClick={() => adjustZoom(-1)}>-</button>
        {since}
        <button onClick={() => adjustZoom(+1)}>+</button>
      </div>

    </>

  )
}

const unusedDefaultTheme = {
  background: 'transparent',
  fontFamily: 'sans-serif',
  fontSize: 11,
  textColor: '#333333',
  axis: {
    domain: {
      line: {
        stroke: 'transparent',
        strokeWidth: 1
      }
    },
    ticks: {
      line: {
        stroke: '#777777',
        strokeWidth: 1
      },
      text: {}
    },
    legend: {
      text: {
        fontSize: 12
      }
    }
  },
  grid: {
    line: {
      stroke: '#dddddd',
      strokeWidth: 1
    }
  },
  legends: {
    text: {
      fill: '#333333'
    }
  },
  labels: {
    text: {}
  },
  markers: {
    lineColor: '#000000',
    lineStrokeWidth: 1,
    text: {}
  },
  dots: {
    text: {}
  },
  tooltip: {
    container: {
      background: 'white',
      color: 'inherit',
      fontSize: 'inherit',
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
      padding: '5px 9px'
    },
    basic: {
      whiteSpace: 'pre',
      display: 'flex',
      alignItems: 'center'
    },
    table: {},
    tableCell: {
      padding: '3px 5px'
    }
  },
  crosshair: {
    line: {
      stroke: '#000000',
      strokeWidth: 1,
      strokeOpacity: 0.75,
      strokeDasharray: '6 6'
    }
  },
  annotations: {
    text: {
      fontSize: 13,
      outlineWidth: 2,
      outlineColor: '#ffffff'
    },
    link: {
      stroke: '#000000',
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: '#ffffff'
    },
    outline: {
      fill: 'none',
      stroke: '#000000',
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: '#ffffff'
    },
    symbol: {
      fill: '#000000',
      outlineWidth: 2,
      outlineColor: '#ffffff'
    }
  }
}
