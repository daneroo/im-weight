import React, { useState } from 'react'
import ButtonFeet from './ButtonFeet'
import HideBottom from './HideBottom'
import RadialGradient from './RadialGradient'
import PullRelease from './PullRelease'
import ValueForRange from './ValueForRange'

// Combine HideBottom/ButtonFeet and RadialGradient
// width if for the gradient, button is 64px
// the button state is coupled to the gradient "big state"
export default function RadialFeet ({
  style, width, height,
  values,
  onClick = ({ big }) => {},
  onDrag = ({ big }) => {}
}) {
  // rename this to adding or adjusting,...
  const [big, setBig] = useState(false)
  const feetBottom = big ? 0 : -20
  const radialBottom = -width / 2 - feetBottom / 2
  const toggle = () => {
    setBig(!big)
    // send !big, as the state has not yet updated
    onClick({ big: !big })
  }
  // careful height is injected by forwardRef, so it can be NaN initially
  const sliderPos = {
    top: ((height || 100) - 64) / 2
    // bottom: 0,
    // left: 0
  }

  const constraints = {
    h: (movement) => [movement[0], 0],
    ll: (movement) => {
      // console.log(movement)
      const [x] = movement
      if (x < 0) return [0, 0]
      // x 0 -> width
      const xN = (width - x) / width // 1->0
      const rad = Math.acos(xN) // 0->pi/2
      return [(1 - Math.cos(rad)) * width, -Math.sin(rad) * width]
    },
    lr: (movement) => {
      // console.log(movement)
      const [x] = movement
      // if (x < 0) return [0, 0]
      // x 0 -> -width
      const xN = (width + x) / width // 1->0
      const rad = Math.acos(xN) // 0->pi/2
      console.log(xN)
      return [-(1 - Math.cos(rad)) * width, -Math.sin(rad) * width]
      // return [movement[0], 0]
    }
  }
  return (
    <HideBottom
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
        height
      }}
    >
      {/* first so it is on bottom (z) */}
      <RadialGradient
        big={big}
        width={width}
        style={{ bottom: radialBottom }}
      />

      <Canvas style={{ bottom: 0 }} big={big} width={width} height={height} />

      <ButtonFeet style={{ bottom: feetBottom }} onClick={toggle} />

      <ValueForRange values={values} />

      {/* last, so it is on top */}
      {!big && (
        <PullRelease style={{ ...sliderPos }} onDrag={onDrag} constrain={constraints.h} />
      )}
      {big && (
        <PullRelease style={{ top: 0, left: 0 }} onDrag={onDrag} />
      )}
      {big && (
        <PullRelease style={{ top: 0, right: 0 }} onDrag={onDrag} />
      )}
      {big && (
        <PullRelease style={{ bottom: 0, left: 0 }} onDrag={onDrag} constrain={constraints.ll} />
      )}
      {big && (
        <PullRelease style={{ bottom: 0, right: 0 }} onDrag={onDrag} constrain={constraints.lr} />
      )}
    </HideBottom>
  )
}

// width: the Width of the control Surface
// big -> adding Observation
function Canvas ({ style, width, big }) {
  const opa = 1
  const thick = 0.01
  const clr = 'rgba(255,255,255,.2)'
  return (
    <div style={{
      ...style,
      // width: '100%',
      width,
      height: width
      // background: clr
    }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 2 2'>
        <g transform='scale(1,-1)'>
          <g transform='scale(.95)'>
            <g
              fill='none'
              strokeWidth={thick}
              strokeDasharray={0.05}
              stroke={clr}
            >
              {!big && (
                <polyline
                  points='-1,0 1,0'
                  opacity={opa}
                />
              )}
              {big && (
                <>
                  <circle cx='1' cy='-1' r='2' />
                  <circle cx='-1' cy='-1' r='2' />
                </>
              )}

            </g>
          </g>
        </g>
      </svg>

    </div>
  )
}
