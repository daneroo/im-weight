import React from 'react'
// This kind of import so it works with StroyBook: next.config.js
import bgImg from './ButtonFeet.png'

export default function ButtonFeet ({ style, onClick = () => {} }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        width: '62px',
        height: '62px',
        background: 'rgba(0,0,0,1)',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        borderRadius: '40%',
        border: '2px solid rgb(128, 128, 255)'
        // boxShadow: '0px -32px 64px 10px rgba(128, 128, 255,1)'
      }}
    />
  )
}
