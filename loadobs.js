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
  
  var file = path.join(__dirname, outfile);
  fs.open(file, "w", 0644, function(err, fd) {
      if (err) throw err;
      fs.write(fd, jsonPretty, 0, "utf8", function(err, written) {
          if (err) throw err;
          fs.closeSync(fd);
      });
  });

});

