import React, { useState } from 'react'
import ButtonFeet from './ButtonFeet'
import RadialGradient from './RadialGradient'
import SpringSlider, { makeConstraints } from './SpringSlider'
import ValueForRange from './ValueForRange'
import DragCanvas from './DragCanvas'

// Combined control panel:
//  - use parent:   position:relative, overflow:hidden
//  - use children: position:absolute
// width is for the gradient, button is 64px
// the button state is coupled to the gradient "big state"
export default function RadialFeet ({
  style, width, height,
  values,
  onClick = ({ big }) => {},
  onDelta = ({ last, delta }) => {}
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

  const constraints = makeConstraints(width, height)

  return (
    <div
      style={{
        // position: 'relative',
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
        style={{ position: 'absolute', bottom: radialBottom }}
      />

      <DragCanvas style={{ position: 'absolute', bottom: 0 }} big={big} onDelta={onDelta} width={width} height={height} />

      <ButtonFeet style={{ position: 'absolute', bottom: feetBottom }} onClick={toggle} />

      <ValueForRange values={values} />

      {/* last, so it is on top */}
      {!big && (
        <SpringSlider style={{ ...sliderPos }} onDelta={onDelta} constrain={constraints.h} />
      )}
    </div>
  )
}
