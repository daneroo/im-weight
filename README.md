# im-weight

- Deployed to vercel @ <https://weight.v.imetrical.com/>
- Deployed to heroku @ <https://im-weight.herokuapp.com/>
- Backed up [GitHub Actions](https://github.com/daneroo/scrobble-weight-data/)
  - See [formatted data here](https://flatgithub.com/daneroo/scrobble-weight-data?filename=formatted.json)
- Backed up from dirac and shannon crons `>~/Code/iMetrical/im-weight/backup`

## TODO

- Replace Loggly with NATS in backup scripts (perhaps in scrobble-weight-data too)
- Upgrade to Next.js v10
- Nx monorepo
- Migrate heroku to use nextjs
- Deploy to netlify
- Vercel github integration
- Infra
  - Turn on history on bucket - with cleanup
  - Add backup/restore/digest methods to npm scripts
    - backup using what credentials? currently open for heroku/vercel, im-dan?
  - backup cron += nats
  - Pulumi
    - Rotate keys with temp script (heroku config < `s3/s3-credentials.json`)
    - provision multiple stacks for S3: dev/prod - enhance config
- App icons, <http://realfavicongenerator.net/> and <http://css-tricks.com/favicon-quiz/>

## Usage

See `./nextjs` for dev and deploy

### Redeploy - Legacy

From legacy-heroku branch (`git checkout legacy-heroku`)

```bash
git push heroku legacy-heroku:master
# previously... from master branch
git push heroku master
```

## Backup/Restore/Credentials

- Credentials
  - See `./s3` for AWS key rotation/provisioning
  - See `./nextjs` for use with vercel enviroment variables
- Backup/restore  
  - See `./backup/README.md` for details of backup/restore

## Historical Logs

- 2021-09-23 Backed up [GitHub Actions](https://github.com/daneroo/scrobble-weight-data/)
- 2021-03-26 redeploy to heroku from legacy with stack-20
- 2020-08-05 Working next.js graphs (Nivo) - no addObs
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
