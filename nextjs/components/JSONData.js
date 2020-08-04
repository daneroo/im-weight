import React, { useState } from 'react'
import useSWR from 'swr'
import moment from 'moment'
import fetcher from './fetcher'

// TODO(daneroo) move data fetching out of this component
// So it can do other messages...
// pass params arrays: {messages[],bylines[]}
export default function JSONData () {
  const { data, error } = useSWR('/api/backup', fetcher)
  const [bylineSecondary, setBylineSecondary] = useState(false)
  const toggleByline = () => setBylineSecondary(!bylineSecondary)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (data.length === 0) return <div>no data...</div>

  const { stamp, value } = data.values[0]
  const fromNow = moment(stamp).fromNow()
  const byline = (bylineSecondary) ? moment(stamp).format('YYYY-MM-DD HH:mm') : fromNow

  return (
    <div
      onClick={toggleByline}
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
      >{Number(value / 1000).toFixed(1)}
      </div>
      <div style={{ fontStyle: 'italic' }}>
        {byline}
      </div>

    </div>
  )
}
