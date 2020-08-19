import React from 'react'
// This kind of import so it works with StroyBook: next.config.js
import bgImg from './BtnBgImg/ButtonFeet.png'
import useTheme from './useTheme'

export default function ButtonFeet ({ style, onClick = () => {} }) {
  const { theme: { colors: { primary, background } } } = useTheme()
  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        width: '62px',
        height: '62px',
        background: background,
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        borderRadius: '40%',
        border: `2px solid ${primary}`
      }}
    />
  )
}
