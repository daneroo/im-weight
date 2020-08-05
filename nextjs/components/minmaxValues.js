
export function minmaxValues (values) {
  return values.reduce(({ min, max }, { value }) => {
    return {
      min: Math.min(min, value),
      max: Math.max(max, value)
    }
  }, { min: Infinity, max: 0 })
}

export function minmaxValuesRounded (values) {
  const { min, max } = minmaxValues(values)

  return {
    min: Math.floor(min - 0.1),
    max: Math.ceil(max + 0.1)
  }
}
