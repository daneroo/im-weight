# im-weight

- Deployed to heroku @ <http://im-weight.herokuapp.com/>

## TODO

- Add S3
  - remove mongo
- JSON.stringify(.,null,2) for output?
- include public/js for linter
- Add backup restore digest methods to npm scripts
- Rotate keys with temp script (heroku config < `s3/s3-credentials.json`)
- Add local minio/s3 for testing - requires test config for s3 endpoint
- Move to vercel/next/S3
- App icons, <http://realfavicongenerator.net/> and <http://css-tricks.com/favicon-quiz/>

## Usage

### Redeploy

```bash
git push heroku master
```

### Develop with local mongodb

You should set `initialRestore=true` in `app.js::init()`

```bash
docker run --rm -p 27017:27017 --name mongo mongo
```

## Backup/Restore

Now that our backend is S3, we can backup and restore with `aws s3 {cp|sync}`

```bash
# checksum
aws --profile im-dan s3 cp s3://im-weight/observationdata.json - | md5sum
curl -s https://im-weight.herokuapp.com/backup | md5sum
cat observationdata.json | md5sum
cat backup/observationdata.json | md5sum

# head (latest)
aws --profile im-dan s3 cp s3://im-weight/observationdata.json - | jq .values[0]
curl -s https://im-weight.herokuapp.com/backup | jq .values[0]
cat backup/observationdata.json | jq .values[0]

# backup
aws --profile im-dan s3 cp s3://im-weight/observationdata.json observationdata.json
# restore
aws --profile im-dan s3 cp observationdata.json s3://im-weight/observationdata.json
```

## Historical Logs

- 2020-07-10 Add S3 for backup, then remove Mongo (Shutdown notice: mLab MongoDB add-on)
- 2020-07-10 Fix CSS Layout/GoogleCharts
- 2019-11-04 Remove Dnode/Shoe/socks (wildly out of date)
- 2015-12-06 Move to heroku
- 2013-07-01 Integrate DNode/shoe/socks
- 2013-06-29 Moved to appfog
- 2011-10-27 convert from iPhone observation.xml plist
- 2011-09-24 Originally deployed to cloudfoundry
- 2011-09-23 restart project from iPhone App

```bash
  heroku apps:create im-weight
  # which added remote: heroku    https://git.heroku.com/im-weight.git
  heroku addons:create mongolab
```

## Historical Below

## Temporary backups

These have been replaced to point to heroku
[Backups from appfog](http://im-weight.aws.af.cm/)
We are making hourly backups in dirac:~/Sites/im-weight/observationdata.json

Note: dnode-shoe-socks has been merged and deployed.

## Deploy to appfog

Seems we need to tell appfog to use node 0.10.x, and use `npm-shrinkwrap.json` which is git-ignored

```bash
  npm shrinkwrap
  af --runtime=node10 update im-weight
```

## Plan (2014-09-20)

We started to move to the new dnode in Jul 2013, but left it unmerged, this is what I'd like to accomplish:

- Deploy a new fronted (separate repo)
  - to simplify will add simple POST to addObs
  - if I can get shoe/socks/dnode to work in the new frontend, we can keep this backend, otherwise move to firebase/meteor
- AngularJS fronted (CORS) - [angular-dygraphs](http://cdjackson.github.io/angular-dygraphs/)
- Eventually Separate the backend, do we keep socks ?

## TODO - Old

- If we are keeping this backend, fix npm outdated: express 4.x,...
- Move to firebase/meteor/angular
- remove cloudfoundry package (npm)
- mv backup script to repo.. on darwin, and dirac

## Moved to appfog : 2013-06-29

When it's up, you can find it [here on appfog](http://im-weight.aws.af.cm/)
Install appfog tools

```bash
gem install af
af login
af update im-weight --runtime=node08
```

## im-weight Mongo backed metric tracker (weight)

When it's up, you can find it [here on cloudfoundry](http://im-w.cloudfoundry.com)
Started from example at
  [cloudfoundry_node_mongodb](https://github.com/gatesvp/cloudfoundry_node_mongodb.git)

```bash
# get dependencies
npm install

# if not yet created...
vmc push im-w

# to push an update
vmc update im-w
```

## Charting

[Dygraphs](http://dygraphs.com/): Google type charting, and add touchmove capability

## icons

[Retina Icons](http://www.iconfinder.com/search/1/?q=iconset%3Atwg_retina_icons)

## Seeding initial data

No longer needed, `plist` has been removed from package.json dependencies.

Could use [xml2json](https://github.com/buglabs/node-xml2json), but try [plist](https://github.com/TooTallNate/node-plist) which uses sax npm module.

```bash
# convert observationdata.xml to observationdata.json
node convert.js

# git diff to confirm, git commit to backup!
```

## Icons old

[Retina Icons](http://www.iconfinder.com/search/1/?q=iconset%3Atwg_retina_icons)
