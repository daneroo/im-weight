// Config section
var port = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();

var orm = require('./lib/orm');

app.use(express.static(__dirname + '/public'));

app.use(cors())
app.use(bodyParser.json());

// factory - curries result to handler
var commonResHandler = function (res) {
  return function (err, doc) {
    if (err) {
      res.writeHead(403, { 'content-type': 'text/json' });
      res.write(JSON.stringify(err, null, 2));
    } else {
      res.writeHead(200, { 'content-type': 'text/json' });
      res.write(JSON.stringify(doc, null, 2));
    }
    res.end('\n');
  }
}
// now the routes
app.get('/backup', function (req, res) {
  console.log('svc.get (GET /backup):');
  svc.get(commonResHandler(res));
});

app.post('/add', function (req, res) {
  var stamp = req.body.stamp;
  var value = req.body.value;
  console.log('svc.add (POST /add):', stamp, value);
  svc.add(stamp, value, commonResHandler(res));
});


function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function init() {
  console.log('Server initialising');
  console.log('..Delay to establish connection to mongo')
  await delay(1000)

  var initialRestore = false;
  if (initialRestore) {
    const obsjson = require('fs').readFileSync(__dirname + '/observationdata.json', 'utf8');
    const restore = JSON.parse(obsjson);

    if (restore.values) {
      console.log('Restoring values');
      orm.save(restore.values);
    } else {
      console.log('ERROR: could not restore values');
    }
  }
  orm.get((err, doc) => {
    if (err) {
      console.log('orm.get:err', err)
    } else {
      // console.log('orm.get:doc', doc)
      console.log('orm.get:doc.values[0..3)', doc.values.slice(0, 3));
    }
  })
}


var svc = {
  get: function (cb) { // cb(err,doc)      
    console.log('svc.get');
    orm.get(cb);
  },
  add: function (stamp, value, cb) {
    console.log('svc.add:', stamp, value);
    //cb({message:'not implemented'});
    orm.add(stamp, value, cb);
  }
};

var server = app.listen(port, async (error) => {
  if (error) {
    console.error('Unable to start server', error)
    return
  }
  await init()
  console.log('Server running: ', process.versions);
  console.log('Listening on port: %s', port);
});

