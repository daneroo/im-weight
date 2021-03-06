import Head from 'next/head'
import styles from './layout.module.css'
// import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

// const name = '@daneroo'

export const siteTitle = 'iM-Weight'

export default function Layout ({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        {/* for full screen : would need a full manifest */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta
          name='description'
          content='Weight Tracker'
        />
        <meta
          property='og:image'
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <header className={styles.header}>
        {/* <img
          src='/images/profile.png'
          className={`${styles.headerImage} ${utilStyles.borderCircle}`}
          alt={name}
        />
        <h2 className={utilStyles.headingLg}>
          <Link href='/'>
            <a className={utilStyles.colorInherit}>{name}</a>
          </Link>
        </h2> */}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href='/'>
            <a>← Back to home</a>
          </Link>
        </div>
      )}
      {/* <footer className={styles.header}>
        <img
          src='/images/profile.png'
          className={`${styles.headerImage} ${utilStyles.borderCircle}`}
          alt={name}
        />
        <h2 className={utilStyles.headingLg}>
          <Link href='/'>
            <a className={utilStyles.colorInherit}>{name}</a>
          </Link>
        </h2>
      </footer> */}

    </div>
  )
}
