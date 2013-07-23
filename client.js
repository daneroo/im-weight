
// This is meant to be browserified
// (by middleware eventually)
// https://github.com/ForbesLindesay/browserify-middleware
// for now:
// ./node_modules/.bin/browserify client.js -o public/js/bundle.js

var shoe = require('shoe');
var dnode = require('dnode');

var stream = shoe('/dnode');

var d = dnode();
d.on('remote', function (remote) {
    app.svc=remote; // global!
    refreshData();

});
d.pipe(stream).pipe(d);

