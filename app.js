// Config section
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0'|| 'localhost');
var mongo = (function(){
  if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
    return mongo;
  } else{
    var mongo = {
      "db":"im-w"
    };
    return mongo;
  }
})();
var mongoURL = (function(obj){
  obj.hostname = obj.hostname || 'localhost';
  obj.port = obj.port || 27017;
  obj.db = obj.db || 'test';
  var auth=(obj.username && obj.password)?(obj.username + ":" + obj.password + "@"):"";
  return "mongodb://" + auth + obj.hostname + ":" + obj.port + "/" + obj.db + "?auto_reconnect=true";
})(mongo);

//console.log("mongo",mongo);
console.log("mongo url",mongoURL);

var express = require('express');
var server = express.createServer();
var dnode = require('dnode');
var mongodb = require('mongodb');

var ioOpts= (process.env.VMC_APP_PORT)?{
  'transports': [
  //'websocket',
  //'flashsocket',
  //'htmlfile',
  'xhr-polling',
  'jsonp-polling'
  ]   
}:{};
server.use(express.static(__dirname+ '/public'));

var w = (function(){
  var obsjson = require('fs').readFileSync(__dirname+'/observationdata.json', 'utf8');
  //console.log(obsjson);
  //console.log('----------');
  return JSON.parse(obsjson);
})();

//console.log(w);
//console.log('----------');
if (0)w.forEach(function(o,i){
  console.log('stamp:%s value:%s',o.stamp,o.value);
});

var collection='observations';
var _id = 'daniel.lauzon@gmail.com';

mongodb.connect(mongoURL, function(err, conn){
  conn.collection(collection, function(err, coll){
    /* Simple object to insert: ip address and date */
    object_to_insert = { _id: _id, values: w };

    /* Insert the object then print in response */
    /* Note the _id has been created */
    coll.save( object_to_insert, {safe:true}, function(err){
      if (err) console.warn(err.message);
      coll.find(/*{_id:_id},*/ function(err, cursor) {
        if (err) console.warn(err.message);
        cursor.toArray(function(err, docs) {
          if (err) console.warn(err.message);
          if (docs.length!=1){
            console.warn('|find(_id)|>1',_id);
          }
          docs.forEach(function(doc) {
            console.log('|%s|:%d\n\t%j\n\t...\n\t%j\n',doc._id,doc.values.length,doc.values[0],doc.values[doc.values.length-1]);
          });
        });
      });
    });
  });
});


var svc = {
    zing : function (n, cb) { 
      //console.log('called server');
      cb(n * 100);
    },
    get: function(cb){
      console.log('svc.get');
      mongodb.connect(mongoURL, function(err, conn){
        conn.collection(collection, function(err, coll){
          coll.find(/*{_id:_id},*/ function(err, cursor) {
            if (err) console.warn(err.message);
            cursor.toArray(function(err, docs) {
              if (err) console.warn(err.message);
              if (docs.length!=1){
                console.warn('|find(_id)|>1',_id);
              }
              cb(docs[0]);
              docs.forEach(function(doc) {
                console.log('|%s|:%d\n\t%j\n\t...\n\t%j\n',doc._id,doc.values.length,doc.values[0],doc.values[doc.values.length-1]);
              });
            });
          });
        });
      });
    },
    add: function(stamp,value,cb){
      console.log('svc.add:',stamp,value);
      cb({message:'not implemented'});
    }
}; 
dnode(svc).listen(server,{ io : ioOpts});

if (!process.env.VMC_APP_PORT) {
  // also listen to 7070 directly (locally)
  dnode(svc).listen(7070);
}


server.listen(port, host);
console.log('http://'+host+':'+port+'/');
