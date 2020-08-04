import React from 'react'
import useSWR from 'swr'
import fetcher from './fetcher'
import Graph from '../components/Graph'
import PullRelease from '../components/PullRelease'
import Link from 'next/link'

import utilStyles from '../styles/utils.module.css'
import styles from './layout.module.css'
import JSONData from './JSONData'

const name = '@daneroo'

export default function WeightPage () {
  const { data, error } = useSWR('/api/backup', fetcher)
  // TODO(daneroo): better loading/error positioning and rendering?
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (!data.values || data.values.length === 0) return <div>no data...</div>

  const { values } = data

  const border = { border: '0px solid red' }
  return (
    <div style={{
      overflow: 'hidden'
    }}
    >
      <section style={{ width: '100%', height: '40vh', ...border }}>
        <Graph values={values} />
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
          <JSONData />

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
