import React from 'react'
import useTheme from './useTheme'
import CheckImgContent from './BtnBgImg/noun_Check_2422594.svg'
import ResetImgContent from './BtnBgImg/noun_reset_299645.svg'

// These glyphs were used in previous experiments
// ANTICLOCKWISE CLOSED CIRCLE ARROW: ⥀
// ANTICLOCKWISE GAPPED CIRCLE ARROW: ⟲
// ANTICLOCKWISE OPEN CIRCLE ARROW: ↺
// CLOCKWISE OPEN CIRCLE ARROW: ↻
// CHECK MARK: ✓
// HEAVY CHECK MARK: ✔
// BALLOT X: ✗
// HEAVY BALLOT X: ✘

function Wrap ({ onClick, children }) {
  const { theme: { colors: { primary, secondary } } } = useTheme()
  const buttonStyle = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    // border: `2px solid ${secondary}`,
    color: secondary,
    backgroundColor: primary
  }
  return (
    <div onClick={onClick} style={buttonStyle}>
      {children}
    </div>

  )
}

export function Reset ({ onClick, fill }) {
  const { theme: { colors: { secondary } } } = useTheme()
  fill = fill || secondary
  return (
    <Wrap onClick={onClick}>
      <svg
        width='64' height='64'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 100 125'
      >
        <g transform='translate(-3,10)'>
          <path
            d='M 23.4149 24.9522 L 23.068 24.7139 L 22.6178 25.3641 L 22.6178 16.5286 C 22.6178 14.7718 21.1903 13.3476 19.4293 13.3476 L 14.9656 13.3476 C 13.2046 13.3476 11.7772 14.7718 11.7772 16.5286 L 11.7772 42.6135 C 11.7772 44.3704 13.2046 45.7946 14.9656 45.7946 L 41.1105 45.7946 C 42.8714 45.7946 44.2989 44.3704 44.2989 42.6135 L 44.2989 38.16 C 44.2989 36.4031 42.8714 34.9789 41.1105 34.9789 L 31.4879 34.9789 C 33.8653 32.235 37.0702 29.6495 39.6359 28.3384 C 40.9112 27.7022 42.1866 27.066 43.3822 26.6683 C 44.5779 26.1912 45.8533 25.8731 47.1286 25.6345 C 48.7228 25.3164 50.7953 25.1573 52.4692 25.1573 C 67.2953 25.1573 79.7301 37.4045 79.7301 52.4351 C 79.7301 52.6737 79.5707 55.0595 79.4112 56.3319 C 78.6938 60.9445 76.7808 65.9547 72.7156 70.7263 C 69.7663 74.146 63.8678 78.1223 58.4475 79.1562 C 54.7808 79.8719 52.9475 82.7349 52.9475 85.5183 C 52.9475 88.8585 55.4982 91.8805 59.2446 91.8805 C 60.6793 91.8805 63.2301 91.0852 64.5054 90.6876 C 70.3243 88.8585 76.2228 85.7569 81.8822 79.6333 C 86.8243 74.2255 89.4547 68.6586 90.9692 63.1712 C 91.6866 60.6264 92.0851 57.6839 92.404 55.139 L 92.404 49.8902 C 92.404 47.1068 90.9692 41.3013 90.1721 39.2336 C 83.0779 19.9881 66.4185 12.433 52.4692 12.433 C 49.8388 12.433 47.1286 12.5921 44.6576 13.1488 C 42.7446 13.5464 40.8315 14.1031 38.9185 14.7393 C 33.8223 16.5456 28.2747 19.8701 23.4149 24.9522 Z'
            fill={fill}
          />
          {/* This is how we centered everything */}
          {/* <g transform='translate(52.5,52.5)'>
            <circle cx='0' cy='0' r='10' fill='none' stroke='black' />
            <circle cx='0' cy='0' r='20' fill='none' stroke='black' />
            <circle cx='0' cy='0' r='30' fill='none' stroke='black' />
            <circle cx='0' cy='0' r='40' fill='none' stroke='black' />
            <circle cx='0' cy='0' r='50' fill='none' stroke='black' />
            <circle cx='0' cy='0' r='60' fill='none' stroke='black' />
          </g> */}
        </g>
      </svg>
    </Wrap>
  )
}

export function Check ({ onClick, fill = 'white' }) {
  return (
    <Wrap onClick={onClick}>
      <svg
        width='64' height='64'
        xmlns='http://www.w3.org/2000/svg'
        // xmlns:xlink='http://www.w3.org/1999/xlink'
        version='1.1' x='0px' y='0px'
        // viewBox='0 0 90 112.5'
        viewBox='0 0 90 90'
      // style='enable-background:new 0 0 90 90;'
      // xml:space='preserve'
      >
        <path
          d='M64.829567,21.5282021c-8.8002777,10.2492008-17.6005974,20.4984016-26.4009972,30.7475014  c-4.3572006-4.6137009-8.7142811-9.2274017-13.0715008-13.8412018c-6.6416988-7.0328999-17.2350998,3.5878029-10.6065998,10.6066017  c6.2089996,6.5746002,12.4179993,13.1492004,18.6269989,19.723896c2.6305008,2.7853012,8.0160027,3.0171051,10.6066017,0  c10.4841003-12.2100983,20.9681015-24.4200974,31.452095-36.6301956  C81.6943665,24.846302,71.1310654,14.1892023,64.829567,21.5282021z'
          fill={fill}
        />
        {/* <text x='0' y='105' fill='#000000' font-size='5px' font-weight='bold' font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by iconcheese</text> */}
        {/* <text x='0' y='110' fill='#000000' font-size='5px' font-weight='bold' font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text> */}
      </svg>
    </Wrap>
  )
}

export function CheckImage ({ onClick, style }) {
  return (
    <img src={CheckImgContent} style={style} />
  )
}

export function CheckBG ({ style }) {
  return (
    <div style={{
      ...style,
      // width: 64,
      // height: 64,
      color: 'white',
      backgroundColor: 'grey',
      backgroundImage: `url(${CheckImgContent})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      borderRadius: '50%'
    }}
    />
  )
}

export function ResetImage ({ onClick, style }) {
  return (
    <img src={ResetImgContent} style={style} />
  )
}

export function ResetSvgBG ({ onClick, fill }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',

        // backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
      // backgroundImage: `url(${CheckImg})`
      // backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100' style='background-color:%23ffffff00;' version='1.1' xml:space='preserve' x='0px' y='0px'%3E%3Cg%3E%3Cpath d='M 23.4149 24.9522 L 23.068 24.7139 L 22.6178 25.3641 L 22.6178 16.5286 C 22.6178 14.7718 21.1903 13.3476 19.4293 13.3476 L 14.9656 13.3476 C 13.2046 13.3476 11.7772 14.7718 11.7772 16.5286 L 11.7772 42.6135 C 11.7772 44.3704 13.2046 45.7946 14.9656 45.7946 L 41.1105 45.7946 C 42.8714 45.7946 44.2989 44.3704 44.2989 42.6135 L 44.2989 38.16 C 44.2989 36.4031 42.8714 34.9789 41.1105 34.9789 L 31.4879 34.9789 C 33.8653 32.235 37.0702 29.6495 39.6359 28.3384 C 40.9112 27.7022 42.1866 27.066 43.3822 26.6683 C 44.5779 26.1912 45.8533 25.8731 47.1286 25.6345 C 48.7228 25.3164 50.7953 25.1573 52.4692 25.1573 C 67.2953 25.1573 79.7301 37.4045 79.7301 52.4351 C 79.7301 52.6737 79.5707 55.0595 79.4112 56.3319 C 78.6938 60.9445 76.7808 65.9547 72.7156 70.7263 C 69.7663 74.146 63.8678 78.1223 58.4475 79.1562 C 54.7808 79.8719 52.9475 82.7349 52.9475 85.5183 C 52.9475 88.8585 55.4982 91.8805 59.2446 91.8805 C 60.6793 91.8805 63.2301 91.0852 64.5054 90.6876 C 70.3243 88.8585 76.2228 85.7569 81.8822 79.6333 C 86.8243 74.2255 89.4547 68.6586 90.9692 63.1712 C 91.6866 60.6264 92.0851 57.6839 92.404 55.139 L 92.404 49.8902 C 92.404 47.1068 90.9692 41.3013 90.1721 39.2336 C 83.0779 19.9881 66.4185 12.433 52.4692 12.433 C 49.8388 12.433 47.1286 12.5921 44.6576 13.1488 C 42.7446 13.5464 40.8315 14.1031 38.9185 14.7393 C 33.8223 16.5456 28.2747 19.8701 23.4149 24.9522 Z' fill='red'/%3E%3C/g%3E%3C/svg%3E\")"
      }}
    />
  )
}
