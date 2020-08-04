import React, { useEffect, useRef } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import JSONData from '../components/JSONData'
import Graph from '../components/Graph'
import PullRelease from '../components/PullRelease'

export default function Home ({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <Graph />
      </section>
      <section>
        <PullRelease />
      </section>
    </Layout>
  )
}
