## Temporary backups
We are making hourlys in dirac:~/Sites/im-weight/observationdata.json

## TODO

* Move to firebase/meteor/angular
* remove cloudfoundry package (npm)
* mv backup script to repo.. on darwin, and dirac

## Moved to appfog : 2013-06-29
When it's up, you can find it [here on appfog](http://im-weight.aws.af.cm/)
Install appfog tools
    gem install af
    af login
    af update im-weight --runtime=node08

## im-weight Mongo backed metric tracker (weight)
When it's up, you can find it [here on cloudfoundry](http://im-w.cloudfoundry.com)
Started from example at
  [cloudfoundry_node_mongodb](https://github.com/gatesvp/cloudfoundry_node_mongodb.git)

    # get dependencies
    npm install
    
    # if not yet created...
    vmc push im-w
    
    # to push an update
    vmc update im-w

## Charting
[Dygraphs](http://dygraphs.com/): Google type charting, and add touchmove capability

## Seeding initial data
Couls use [xml2json](https://github.com/buglabs/node-xml2json), but try [plist](https://github.com/TooTallNate/node-plist) which uses sax npm module.

    # convert observationdata.xml to observationdata.json
    node convert.js
    
    # git diff to confirm, git commit to backup!

## icons

[Retina Icons](http://www.iconfinder.com/search/1/?q=iconset%3Atwg_retina_icons)
