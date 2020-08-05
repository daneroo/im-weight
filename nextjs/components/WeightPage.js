import React, { useState } from 'react'
import moment from 'moment'
import useSWR from 'swr'
import fetcher from './fetcher'
import Graph from '../components/Graph'
import PullRelease from '../components/PullRelease'
import Link from 'next/link'

import utilStyles from '../styles/utils.module.css'
import styles from './layout.module.css'
import ValueForRange from './ValueForRange'

const name = '@daneroo'
const zoomMonths = [3, 6, 12, 24, 36, 60, 999999]

// TODO refactor zoomFiltering : what if no data
// TODO better handling if filter => no data
export default function WeightPage () {
  const [zoom, setZoom] = useState(0)
  const { data, error } = useSWR('/api/backup', fetcher)
  // TODO(daneroo): better loading/error positioning and rendering?
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (!data.values || data.values.length === 0) return <div>no data...</div>

  const scale = ({ stamp, value }) => ({ stamp, value: value / 1000 })
  const sinceMoment = moment().subtract(zoomMonths[zoom], 'months')
  const filterSince = ({ stamp, value }) => moment(stamp).isAfter(sinceMoment)

  // values: scaled and filtered for current time range [{stamp,value}]
  const values = data.values.map(scale).filter(filterSince)

  if (values.length === 0) return <div>no data...</div>

  // without the "ago"
  // const since = sinceMoment.fromNow(true)
  // const since = moment(values.slice(-1)[0].stamp).fromNow(true)
  const since = (values.length === 0) ? sinceMoment.fromNow(true) : moment(values.slice(-1)[0].stamp).fromNow(true)

  const adjustZoom = (delta) => {
    setZoom((zoom + delta + zoomMonths.length) % zoomMonths.length)
  }

  const border = { border: '0px solid red' }
  return (
    <div style={{
      overflow: 'hidden'
    }}
    >
      <section style={{ width: '100%', height: '40vh', ...border }}>
        <Graph values={values} since={since} adjustZoom={adjustZoom} />
      </section>

      <section style={{ width: '100%', height: '50vh', ...border }}>
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        >
          <ValueForRange values={values} />

          <PullRelease />

          <footer className={styles.header}>
            <h2 className={utilStyles.headingLg}>
              <Link href='/'>
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </footer>

        </div>
      </section>

    </div>
  )
}
