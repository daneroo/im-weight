import React, { useState } from 'react'
import ButtonFeet from './ButtonFeet'
import HideBottom from './HideBottom'
import RadialGradient from './RadialGradient'
import PullRelease from './PullRelease'
import ValueForRange from './ValueForRange'

// Combine HideBottom/ButtonFeet and RadialGradient
// width if for the gradient, button s 64px
// the button state is coupled to the gradient "big state"
export default function RadialFeet ({
  style, width, height,
  values,
  onClick = ({ big }) => {},
  onDrag = ({ big }) => {}
}) {
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

  return (
    <HideBottom
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
        height: width
      }}
    >
      {/* first so it is on bottom (z) */}
      <RadialGradient
        big={big}
        width={width}
        style={{ bottom: radialBottom }}
      />

      <ButtonFeet style={{ bottom: feetBottom }} onClick={toggle} />

      <ValueForRange values={values} />

      {/* last, so it is on top */}
      <PullRelease style={{ ...sliderPos }} onDrag={onDrag} />
    </HideBottom>
  )
}
