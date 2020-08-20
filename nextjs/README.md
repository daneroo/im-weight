# Next.js branch of im-weight

## TODO

- Vercel
  - new cli
  - Add put/get native ops for vercel.
  - ad secret to vercel (which environments)
  - add health(Z)/head
  - add route for get
  - custom domain
  - github integration
- Merge to master, when addObs done
- replace og-image, once deployed to vercel
- Buttons
  - Act more like buttons on press/hover
- ValueFor{Range|Adding} combine with {AnchorZoom/ArcSlider} (as Components)
- Rationalize ValueForAdding layout/styles
- Animate BottomFeet/Panel movements/opacity
- Update to StoryBook-6
- full screen (no browser bar)
- fonts (Roboto, Tondo )
- Cleanup layout and all css
- Add theme-ui (light/dark)

- Update README in top level README
  - Legacy heroku
  - Deploy to vercel
  - update backups script `/api/observations`

## Usage

### Vercel setup

```bash
npm i -g vercel
```

### Credentials and Secrets

`vercel login` stores token in `/Users/daniel/Library/Application\ Support/com.vercel.cli/`

```bash

# global (non-project) secrets
vercel secrets add secret_key "secret_value"
# this can then be used in vercel.json:env:{ZZZ:'@secret_key'}

# project specific..
echo -n 'dev_secret' | vercel env add SECRET development
echo -n 'dev_secret_update' | vercel env add SECRET development

# full rotation example
(echo 'y' | vercel env rm SECRET development) ; echo $?; ( echo -n $(date -u +"%Y-%m-%dT%H:%M:%SZ") | vercel env add SECRET development); echo $?;

vercel env pull .env.local

(echo 'y' | vercel env rm ACCESS_KEY_ID development) ; echo $?; ( echo -n $(cat ../s3/s3-credentials.json | jq -r .AccessKeyId) | vercel env add ACCESS_KEY_ID development); echo $?;
(echo 'y' | vercel env rm SECRET_ACCESS_KEY development) ; echo $?; ( echo -n $(cat ../s3/s3-credentials.json | jq -r .SecretAccessKey) | vercel env add SECRET_ACCESS_KEY development); echo $?;

vercel env pull .env.local

```

### Deployment

```bash
npm run deploy:vercel
vercel --prod
```

### Development

## Charting

- [React/D3 Chart review](https://dev.to/giteden/top-5-react-chart-libraries-for-2020-1amb)
  - [Nivo](https://nivo.rocks/line/)
  - [Swizec - d3blackbox](https://github.com/Swizec/d3blackbox)

## References

- [HTML entities](https://www.toptal.com/designers/htmlarrows/symbols/)

## Creative Common Attribution

I used 2 icons (svg_ from *The nous project* which require this attribution:

- [Check by iconcheese from the Noun Project](https://thenounproject.com/term/check/2422594/)
- [reset by Roberto Chiaveri from the Noun Project](https://thenounproject.com/term/reset/299645/)
