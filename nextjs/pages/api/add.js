const axios = require('axios')

// implemented as GET/POST /api/add -> rename to /api/observations (plural)
export default async function (req, res) {
  const {
    body: { value, stamp = new Date().toISOString() },
    method
  } = req
  console.log('server', { method, value, stamp })

  switch (method) {
    // case 'GET':
    //   // Get data from your database
    //   try {
    //     const { data } = await axios.get('http://im-weight.herokuapp.com/backup')
    //     res.json(data)
    //   } catch (error) {
    //     res.status(502).json({ error: error.toString() })
    //   }
    //   break
    case 'POST':
      try {
        const { data } = await axios.post('http://im-weight.herokuapp.com/add', { value, stamp })
        res.json(data)
      } catch (error) {
        res.status(502).json({ error: error.toString() })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}
