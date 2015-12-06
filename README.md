## Todo

* Fix connectio init (delay of 1 sec to initialize db...)
* remove or fix dnode,
  * ./node_modules/.bin/browserify client.js -o public/js/bundle.js
  * https://gist.github.com/nathan7/3729590
* Use position:fixed for bottom layer
* App icons, http://realfavicongenerator.net/ and http://css-tricks.com/favicon-quiz/

## 2015-12-06 Move to heroku

    heroku apps:create im-weight
    # which added remote: heroku    https://git.heroku.com/im-weight.git
    heroku addons:create mongolab

## Testing with local mongodb

    docker run -d -p 27017:27017 -p 28017:28017 --name mongo mongo


## Temporary backups
These have been replaced to point to heroku
[Backups from appfog](http://im-weight.aws.af.cm/)
We are making hourlys in dirac:~/Sites/im-weight/observationdata.json

Note: dnode-shoe-socks has been merged and deployed.

## Deploy to appfog:
Seems we need to tell appfog to use node 0.10.x, and use `npm-shrinkwrap.json` which is git-ignored

    npm shrinkwrap
    af --runtime=node10 update im-weight


## Plan (2014-09-20)
We started to move to the new dnode in Jul 2013, but left it unmerged, this is what I'd like to accomplish:

- Deploy a new fronted (seperate repo)
    - to simplify will add simple POST to addObs
    - if I can get shoe/socks/dnode to work in the new frontend, we can keep this backend, otherwise move to firebase/meteor

- AngularJS fronted (CORS) - [angular-dygraphs](http://cdjackson.github.io/angular-dygraphs/)
- Eventually Separate the backend, do we keep socks ?

## TODO

* If we are keeping this backend, fix npm outdated: express 4.x,...
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

## icons

[Retina Icons](http://www.iconfinder.com/search/1/?q=iconset%3Atwg_retina_icons)

## Seeding initial data

No longer needed, `plist` has been removed from package.json dependancies.

Could use [xml2json](https://github.com/buglabs/node-xml2json), but try [plist](https://github.com/TooTallNate/node-plist) which uses sax npm module.

    # convert observationdata.xml to observationdata.json
    node convert.js
    
    # git diff to confirm, git commit to backup!

## icons

[Retina Icons](http://www.iconfinder.com/search/1/?q=iconset%3Atwg_retina_icons)
