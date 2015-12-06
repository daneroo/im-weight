
// var mongodb = require('mongodb');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient

// Taken from ax-patin
// https://support.mongolab.com
// taken from blogpost: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://docker/patin'; // default to local docker see README for docker instruction

var collectionName='entries';
var db=null; // persisted db connection object

MongoClient.connect(mongoUri, function(err, _db) {
    // if error we will never work...
    if (err) {
        console.log('Error Connecting to',mongoUri,err);
        return;
    }
    console.log('Connected to',mongoUri);
    // Save the db reference
    db = _db;
});



exports = module.exports;


function checkError(error,cb){
  if (error) {
    console.error(error.message);
    if (cb) cb(error);
    return true;
  }
  return false;
}


var collectionName='observations';
var _id = 'daniel.lauzon@gmail.com';
function getCollection(cb) { // cb(err,conn)
  db.collection(collectionName, function(err, coll){
    if(checkError(err,cb)) return;
    if (cb) cb(err,coll);
  });
}

function sortByStamp(values,direction){
  direction = direction || -1;
  values.sort(function(a,b){
    return direction*(Date.parse(a.stamp) - Date.parse(b.stamp));
  });
}

exports.get = function(cb){ // cb(err,doc)
  console.log('orm.get');
  getCollection(function(err,coll){
    if(checkError(err,cb)) return;
    coll.find({_id:_id}, function(err, cursor) {
      if(checkError(err,cb)) return;
      cursor.toArray(function(err, docs) {
        if(checkError(err,cb)) return;

        if (docs.length===0){
          // FIX: allow first document creation for now
          // cb({message:'document not found'});
          cb(null,{
            "_id": "daniel.lauzon@gmail.com",
            "values": []
          });
          return;
        }


        if (docs.length>1){
          console.warn('|find(_id)|>1',_id,docs.length);
        }
        cb(null,docs[0]);

        // we are done this is for verbose
        if (0) docs.forEach(function(doc) {
          console.log('-|%s|:%d\n\t%j\n\t...\n\t%j\n',doc._id,doc.values.length,doc.values[0],doc.values[doc.values.length-1]);
          //sortByStamp(doc.values);
          //console.log('+|%s|:%d\n\t%j\n\t...\n\t%j\n',doc._id,doc.values.length,doc.values[0],doc.values[doc.values.length-1]);
        });

      });
    });
    
  });
  
};

exports.add = function(stamp,value,cb){ // cb(err,doc)
  console.log('orm.add -',stamp,value);
  if (!stamp){
    stamp = new Date().toISOString();
  } else {
    var norm = new Date(Date.parse(stamp)).toISOString();
    if (norm=='Invalid Date'){
      console.error('Invalid Date');
      if (cb) cb({message:'Invalid Date'});
      return;
    }
    stamp=norm;
  }
  // if value not numeric...
  var asnum = parseFloat(value);
  if (isNaN(asnum)) { 
    if (cb) cb({message:'Invalid Value'});
    return;
  }
  value = Math.round(asnum*1000);
  console.log('orm.add +',stamp,value);
  // get append sort save
  exports.get(function(err,doc){
    if(checkError(err,cb)) return;
    doc.values.push({stamp:stamp,value:value});
    sortByStamp(doc.values);
    exports.save(doc.values,cb);
  });
}   
exports.save = function(values,cb){ // cb(err,doc)
  console.log('orm.save');
  getCollection(function(err,coll){
    if(checkError(err,cb)) return;

    /* Simple object to insert: ip address and date */
    var doc = { _id: _id, values: values };
    
    /* Insert the object then print in response */
    /* Note the _id has been created */
    coll.save( doc, {safe:true}, function(err){
      if(checkError(err,cb)) return;
      
      // could return the _id or something
      if (cb) cb(null,null);
      
      // we are done this is for verbose
      if (0) exports.get(function(err,doc){
        console.log('confirm save');
        if (err){
          // do something with err
        } else {
          // do something with doc
        }
      });
      
    }); // save
  }); // collection
}
