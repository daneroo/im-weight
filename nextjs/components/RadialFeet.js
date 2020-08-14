import React, { useState } from 'react'
import ButtonFeet from './ButtonFeet'
import RadialGradient from './RadialGradient'
import ValueForRange from './ValueForRange'
import { AnchorZoom, ArcSlide } from './DragSVG'

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

      {!big && (
        <AnchorZoom
          style={{ position: 'absolute', bottom: 0, overflow: 'hidden', width, height }}
          width={width}
          onDelta={onDelta}
        />
      )}
      {big && (
        <ArcSlide
          style={{ position: 'absolute', bottom: 0, overflow: 'hidden', width, height }}
          width={width}
          onDelta={onDelta}
        />
      )}
      <ButtonFeet style={{ position: 'absolute', bottom: feetBottom }} onClick={toggle} />

      <ValueForRange values={values} />

    </div>
  )
}
