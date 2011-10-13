/*
  refs: 
  http://www.quora.com/What-is-the-best-way-to-read-a-file-line-by-line-in-node-js
  http://blog.jaeckel.com/2010/03/i-tried-to-find-example-on-using-node.html
  
*/
/* Http Variables */

var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var http = require('http'), fs = require('fs'), path=require('path');

var parseTime = function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});

    var allText = fs.readFileSync(path.join(__dirname, 'TEST.txt'), 'utf8'); //.toString()
    var lines = allText.split('\n');
    lines.forEach(function (line) { 
        res.write(line+'\n');
    });

    res.end('\n');
}

http.createServer(function (req, res) {
  parseTime(req, res);
}).listen(port, host);
console.log('open http://'+host+':'+port);

