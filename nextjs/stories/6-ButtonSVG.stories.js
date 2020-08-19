import React from 'react'
import { action } from '@storybook/addon-actions'
import { Check, Reset, CheckImage, CheckBG, ResetImage } from '../components/ButtonsSVG'

export default {
  title: 'ButtonSVG'
}

export const CheckExample = () => <Check onClick={action('clicked')} />
export const ResetExample = () => <Reset onClick={action('clicked')} />

// These are just experiments, with edited svg in components/BtnBgImg/*svg
export const CheckImageExample = () => <CheckImage style={{ width: 100, height: 100 }} />
export const CheckBGExample = () => <CheckBG style={{ width: 100, height: 100 }} />

export const ResetImageExample = () => <ResetImage style={{ width: 100, height: 100 }} />
