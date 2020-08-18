import React, { useState } from 'react'
import ButtonFeet from './ButtonFeet'
import RadialGradient from './RadialGradient'
import ValueForRange from './ValueForRange'
import ValueForAdding from './ValueForAdding'
import { AnchorZoom, ArcSlider } from './DragSVG'
import useDeltaDrag from './useDeltaDrag'

// Combined control panel:
//  - use parent:   position:relative, overflow:hidden
//  - use children: position:absolute
// width is for the gradient, button is 64px
// the button state is coupled to the gradient "big state"
export default function ControlPanel ({
  style, width, height,
  values,
  onClick = ({ addingObs }) => {},
  onDelta = ({ last, delta }) => {},
  add = async ({ value, stamp }) => {} // from useStorage
}) {
  const [addingObs, setAddingObs] = useState(false)

  // This could be moved to own component
  const adjustArcSliderDelta = ({ delta, referenceValue }) => {
    // scale delta and round to 5ths i.e. *.{0,2,4,6,8}
    const scale = 2
    const nths = 10
    const roundToNth = (value, nths) => Math.round(value * nths) / nths
    const value = roundToNth(delta * scale + referenceValue, nths)
    return value
  }
  const [arcSliderValue, updateDragArcSlider, resetArcSlider] = useDeltaDrag(values[0].value, adjustArcSliderDelta)

  const feetBottom = addingObs ? 0 : -20
  const radialBottom = -width / 2 - feetBottom / 2
  const toggleAddingObs = () => {
    const nuAddingObs = !addingObs
    setAddingObs(nuAddingObs)
    // send !addingObs, as the state has not yet updated
    onClick({ addingObs: nuAddingObs })

    resetArcSlider()
  }

  // wraps useStorage.add with panel control (back to addingObs=false)
  const addAndClose = async ({ value, stamp }) => {
    try {
      const ok = await add({ value, stamp })
      setAddingObs(false)
      return ok
    } catch (error) {
      console.error('Add', error.toString())
      throw error
    }
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
        big={addingObs}
        width={width}
        style={{ position: 'absolute', bottom: radialBottom }}
      />

      {!addingObs && (
        <>
          <AnchorZoom
            style={{ position: 'absolute', bottom: 0, overflow: 'hidden', width, height }}
            width={width}
            onDelta={onDelta}
          />
          <ValueForRange style={{ zIndex: 1 }} values={values} />
        </>
      )}
      {addingObs && (
        <>
          <ValueForAdding style={{ zIndex: 1 }} add={addAndClose} reset={resetArcSlider} value={arcSliderValue} />
          <ArcSlider
            style={{ position: 'absolute', bottom: 0, overflow: 'hidden', width, height }}
            width={width}
            onDelta={updateDragArcSlider}
          />
        </>
      )}
      <ButtonFeet style={{ position: 'absolute', bottom: feetBottom }} onClick={toggleAddingObs} />

    </div>
  )
}
