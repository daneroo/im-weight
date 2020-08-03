// Config section
var port = process.env.PORT || 3000

const path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express()

var orm = require('./lib/orm')

app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())
app.use(bodyParser.json())

// factory - curries result to handler
var commonResHandler = function (res) {
  return function (err, doc) {
    if (err) {
      res.writeHead(400, { 'content-type': 'text/json' })
      res.write(JSON.stringify({ message: err.toString() }, null, 2))
    } else {
      res.writeHead(200, { 'content-type': 'text/json' })
      res.write(JSON.stringify(doc, null, 2))
    }
    res.end('')
  }
}
// now the routes
app.get('/backup', function (req, res) {
  console.log('svc.get (GET /backup):')
  svc.get(commonResHandler(res))
})

app.post('/add', function (req, res) {
  var stamp = req.body.stamp
  var value = req.body.value
  console.log('svc.add (POST /add):', stamp, value)
  svc.add(stamp, value, commonResHandler(res))
})

async function init () {
  console.log('Server initializing')

  // just to validate our aws key, and show last three measurements
  orm.get((err, doc) => {
    if (err) {
      console.log('app.init -> orm.get:error', err.toString())
    } else {
      // console.log('orm.get:doc', doc)
      console.log('orm.get:doc.values[0..3)', doc.values.slice(0, 3))
    }
  })
}

var svc = {
  get: function (cb) { // cb(err,doc)
    orm.get(cb)
  },
  add: function (stamp, value, cb) {
    orm.add(stamp, value, cb)
  }
}

/* var server = */ app.listen(port, async (error) => {
  if (error) {
    console.error('Unable to start server', error)
    return
  }
  await init()
  console.log('Server running: ', process.versions)
  console.log('Listening on port: %s', port)
})
