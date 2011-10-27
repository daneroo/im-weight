## im-w Mongo backed metric tracker (weight)
When it's up, you can find it [here](http://im-w.cloudfoundry.com)
Started from example at
  [cloudfoundry_node_mongodb](https://github.com/gatesvp/cloudfoundry_node_mongodb.git)

    # get dependencies
    npm install
    
    # if not yet created...
    vmc push im-w
    # 5-add redis - ax-rq-redis
    
    # to push an update
    vmc update im-w


## Seeding initial data
Couls use [xml2json](https://github.com/buglabs/node-xml2json), but try [plist](https://github.com/TooTallNate/node-plist) which uses sax npm module.

    # convert observationdata.xml to observationdata.json
    node loadobs.js
    
    # git diff to confirm, git commit to backup!