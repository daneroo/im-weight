import React from 'react'
import { action } from '@storybook/addon-actions'
import ButtonFeet from '../components/ButtonFeet'
import HideBottom from '../components/HideBottom'

export default {
  title: 'ButtonFeet',
  component: ButtonFeet
}

export const Example = () => <ButtonFeet onClick={action('clicked')} />

export const HiddenBottom = () => {
  return (
    <div style={{
      color: 'white',
      height: 3 * (128),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}
    >
      {[0, -20].map((bottom) => {
        return (
          <div key={bottom}>
            <pre>{JSON.stringify({ bottom })}</pre>
            <HideBottom
              style={{
                border: '1px solid green',
                height: 64,
                width: 64
              }}
            >
              <ButtonFeet style={{ bottom }} onClick={action('clicked')} />
            </HideBottom>
          </div>
        )
      })}
    </div>)
}

export const Wrapped = () => {
  return (
    <div style={{
      border: '1px solid red',
      color: 'white',
      height: 3 * (128),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}
    >
      {[0, 10, -10].map((bottom) => {
        return (
          <div key={bottom}>
            <pre>{JSON.stringify({ bottom })}</pre>
            <div
              style={{
                border: '1px solid green',
                // margin: 10,
                overflow: 'hidden',
                height: 64,
                width: 64,
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', bottom: bottom }}>
                <ButtonFeet onClick={action('clicked')} />
              </div>
            </div>
          </div>
        )
      })}
    </div>)
}
