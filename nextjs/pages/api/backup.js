const axios = require('axios')

export default async function (req, res) {
  try {
    const { data } = await axios.get('http://im-weight.herokuapp.com/backup')
    res.json(data)
  } catch (error) {
    res.status(502).json({ error: error.toString() })
  }
}
