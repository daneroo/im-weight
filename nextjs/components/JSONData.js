import useSWR from 'swr'
import fetcher from './fetcher'
import utilStyles from '../styles/utils.module.css'

export default function JSONData () {
  const { data, error } = useSWR('/api/backup', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (data.length === 0) return <div>no data...</div>
  const { stamp, value } = data.values[0]
  return (
    // <pre>{JSON.stringify(data.values.slice(0, 3), null, 2)}</pre>
    <div style={{
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
        // className={utilStyles.headingXl}
      >{Number(value / 1000).toFixed(1)}
      </div>
      <div style={{ fontStyle: 'italic' }}>
        {/* {stamp.slice(0, 10)} */}
        2 days ago
      </div>

    </div>
  )
}
