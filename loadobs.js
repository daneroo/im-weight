var plist = require('plist'),
    path = require('path')
    fs = require('fs');

var infile = 'observationdata.xml';
var outfile = 'observationdata.json';
plist.parseFile(infile, function(err, plist) {
  if (err) throw err;
  var obs = plist[0];

  console.log('found '+obs.length+' observations');
  console.log('  '+obs[obs.length-1].stamp+' ... '+obs[0].stamp);

  var jsonPretty = JSON.stringify(obs,null,2);
  
  fs.writeFileSync(path.join(__dirname, outfile), jsonPretty,'utf8');

});