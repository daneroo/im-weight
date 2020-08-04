import React from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import WeightPage from '../components/WeightPage'

export default function Home ({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <WeightPage />
    </Layout>
  )
}
