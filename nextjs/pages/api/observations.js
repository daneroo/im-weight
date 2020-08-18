const axios = require('axios')

const PROXY_GET = 'http://im-weight.herokuapp.com/backup'
const PROXY_POST = 'http://im-weight.herokuapp.com/add'

// /api/observations (plural) GET/POST
export default async function (req, res) {
  const { url, method } = req

  switch (method) {
    case 'GET':
      // Get data from your database
      try {
        console.log('server', { url, method })
        const { data } = await axios.get(PROXY_GET)
        res.json(data)
      } catch (error) {
        res.status(502).json({ error: error.toString() })
      }
      break
    case 'POST':
      try {
        const { body: { value, stamp } } = req
        console.log('server', { url, method, value, stamp })

        const { data } = await axios.post(PROXY_POST, { value, stamp })
        res.json(data)
      } catch (error) {
        res.status(502).json({ error: error.toString() })
      }
      break
    default:
      console.log('server', { url, method })
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}
