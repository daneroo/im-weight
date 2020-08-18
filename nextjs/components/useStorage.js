
import axios from 'axios'

import useSWR, { mutate } from 'swr'

const GET_URL = '/api/backup'
const POST_URL = '/api/add'

// utility func for useSWR
async function fetcher (url) {
  // return axios.get(url).then(res => res.data)
  const { data } = await axios.get(url)
  return data
}

// get(): wraps the useSWR hook
// returns { data, error }
export function get () {
  console.log('about to GET')
  return useSWR(GET_URL, fetcher)
}

// add(): wraps axios POST
// TODO: https://swr.vercel.app/docs/mutation#mutate-based-on-current-data
export async function add ({ value, stamp }) {
  console.log('about to POST (client)', ({ value, stamp }))

  try {
    const { data } = await axios({
      method: 'POST',
      url: POST_URL,
      data: { value, stamp }
    })
    console.log('got (POST)', data)
    // tell all SWR qys with this key to revalidate
    mutate(GET_URL)

    return data
  } catch (error) {
    console.error('Add error', error)
  }
}
