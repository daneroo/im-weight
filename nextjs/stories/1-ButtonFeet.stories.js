import React from 'react'
import { action } from '@storybook/addon-actions'
import ButtonFeet from '../components/ButtonFeet'

export default {
  title: 'ButtonFeet',
  component: ButtonFeet
}

export const Example = () => <ButtonFeet onClick={action('clicked')} />

export const Wrapped = () => {
  return (
    <div style={{
      color: 'white'
    }}
    >
      <p>
        You can partially hide content by setting
        <ul>
          <li>a parent
            to <tt>position: relative</tt>
          </li>
          <li>
            and it's chilren to:
            <ul>
              <li>position: absolute,</li>
              <li>overflow: 'hidden', or at least</li>
              <li>bottom:...</li>
            </ul>
          </li>
        </ul>
      </p>
      <div style={{
        color: 'white',
        // height: 3 * (128),
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
      </div>
    </div>
  )
}
