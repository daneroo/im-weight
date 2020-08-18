import React, { useState } from 'react'
import moment from 'moment'
import useTheme from './useTheme'

// We only pass in value
// but stamp is managed locally
export default function ValueForAdding ({ value, reset = () => {}, add = async ({ value, stamp }) => {}, style }) {
  const { theme: { colors: { primary, secondary } } } = useTheme()

  const [stamp, setStamp] = useState(null)
  const hasStamp = stamp !== null

  //  here is where I can round this off...
  const onSubmit = async () => {
    const data = await add({ value, stamp })
    console.log('ValueForAdding got', data)
  }
  const onReset = () => {
    setStamp(null)
    reset()
  }
  const localTimeForPicker = (stamp) => {
    return moment(stamp).local().format('YYYY-MM-DDTHH:mm')
  }
  // console.log({ stamp, local: localTimeForPicker(stamp) })

  const onStampChange = (e) => {
    const nuStampLocal = e.target.value
    const nuStampUTC = moment(nuStampLocal).utc().toISOString()
    console.log({ nuStampLocal, nuStampUTC })
    setStamp(nuStampUTC)
  }
  const buttonStyle = {
    // ANTICLOCKWISE CLOSED CIRCLE ARROW: ⥀
    // ANTICLOCKWISE GAPPED CIRCLE ARROW: ⟲
    // ANTICLOCKWISE OPEN CIRCLE ARROW: ↺
    // CLOCKWISE OPEN CIRCLE ARROW: ↻
    // CHECK MARK: ✓
    // HEAVY CHECK MARK: ✔
    // BALLOT X: ✗
    // HEAVY BALLOT X: ✘
    fontSize: '2rem',
    fontStyle: 'bold',
    margin: '0 1rem',
    textAlign: 'center',
    minWidth: '3rem',
    // minHeight: '3rem',
    borderRadius: '50%',
    // border: `2px solid ${secondary}`,
    color: secondary,
    backgroundColor: primary
  }
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around', // center
        alignItems: 'center'
      }}
      >
        {/* reset */}
        <div onClick={onReset} style={buttonStyle}>✘</div>
        <div style={{
          color: secondary,
          textAlign: 'center',
          minWidth: '10rem',
          padding: '0.5rem',
          fontSize: '3rem',
          lineHeight: 1.2,
          fontWeight: 600,
          border: `2px solid ${primary}`,
          borderRadius: '1rem'
        }}
        >{Number(value).toFixed(1)}
        </div>
        {/* add/confirm */}
        <div onClick={onSubmit} style={buttonStyle}>✔</div>

      </div>
      {hasStamp ? (
        <input type='datetime-local' value={localTimeForPicker(stamp)} onChange={onStampChange} />
      ) : (
        <div
          onClick={() => setStamp(new Date().toISOString())}
          style={{ fontStyle: 'italic', fontWeight: 'bold' }}
        >
          Now
        </div>

      )}

    </div>
  )
}
