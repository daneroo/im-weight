
import { useState } from 'react'

// controls the state of an incremental drag slider's value
export default function useDeltaDrag (initialReference = 0) {
  const [referenceValue, setReferenceValue] = useState(initialReference)
  const [value, setValue] = useState(referenceValue)

  const updateDrag = ({ delta, last }) => {
    // delta  is [-1,+1] // while we are dragging
    const nuValue = referenceValue + delta
    setValue(nuValue)
    if (last) {
      setReferenceValue(nuValue)
    }
  }
  const reset = () => {
    setValue(initialReference)
    setReferenceValue(initialReference)
  }
  return [value, updateDrag, reset]
}
