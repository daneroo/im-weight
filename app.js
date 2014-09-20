// Config section
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0'|| 'localhost');

var express = require('express');
var app = express();
var shoe = require('shoe');
var dnode = require('dnode');

var orm = require('./lib/orm');

app.use(express.static(__dirname+ '/public'));
// bodyParser will move to separate middleware...
app.use(express.bodyParser());
// Allow CORS - to move frontend
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(allowCrossDomain);

// factory - curries result to handler
var commonResHandler = function(res){
  return function(err,doc){
    if (err){
      res.writeHead(403, {'content-type': 'text/json' });
      res.write( JSON.stringify(err,null,2) );
    } else {
      res.writeHead(200, {'content-type': 'text/json' });
      res.write( JSON.stringify(doc,null,2) );
    }
    res.end('\n');
  }  
}
// now the routes
app.get('/backup', function(req, res){
  console.log('svc.get (GET /backup):');
  svc.get(commonResHandler(res));
});

app.post('/add', function(req, res){
  var stamp = req.body.stamp;
  var value = req.body.value;
  console.log('svc.add (POST /add):',stamp,value);
  svc.add(stamp,value,commonResHandler(res));
});

app.post('/zing', function(req, res){
  var n = req.body.n;
  console.log('svc.zing (POST /zing):',n);
  svc.zing(n,commonResHandler(res));
});


var initialLoad=false;
if (initialLoad){
  var restore = (function(){
    var obsjson = require('fs').readFileSync(__dirname+'/observationdata.json', 'utf8');
    //console.log(obsjson);
    //console.log('----------');
    return JSON.parse(obsjson);
  })();
  if (restore.values){
    console.log('restoring values');
    orm.save(restore.values);
  } else {
    console.log('ERROR: could not restore values');
  }
}

var svc = {
  zing : function (n, cb) { 
    console.log('svc.zing',n);
    var asnum = parseFloat(n);
    if (isNaN(asnum)) { 
      if (cb) cb({message:'Invalid Value'});
      return;
    }
    n = asnum;
    cb(null,n * 100);
  },
  get: function(cb){ // cb(err,doc)      
    console.log('svc.get');
    orm.get(cb);
  },
  add: function(stamp,value,cb){
    console.log('svc.add:',stamp,value);
    //cb({message:'not implemented'});
    orm.add(stamp,value,cb);
  }
};

var server = app.listen(port, host);
console.log('http://'+host+':'+port+'/');

// could disable only in production...
socksjsOpts = {
  websocket: false,
  prefix: '/dnode'
};

var sock = shoe(function (stream) {
  var d = dnode(svc);
  d.pipe(stream).pipe(d);
});
sock.install(server, socksjsOpts);
