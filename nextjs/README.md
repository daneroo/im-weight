# Next.js branch of im-weight

 Deployed to <https://weight.v.imetrical.com/>

## TODO

- Upgrade to next.js v10
- Replace og-image, once deployed to vercel
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

## Usage

### Deployment

```bash
npm run deploy:vercel
vercel --prod
```

### Credentials and Secrets

`vercel login` stores token in `/Users/daniel/Library/Application\ Support/com.vercel.cli/`

```bash
./push_vercel_creds.sh
./push_vercel_creds.sh preview
./push_vercel_creds.sh production
```

Other vercel `env/secret` notes

```bash
# global (non-project) secrets
vercel secrets add secret_key "secret_value"
# this can then be used in vercel.json:env:{ZZZ:'@secret_key'}

# project specific..
echo -n 'dev_secret' | vercel env add SECRET development
echo -n 'dev_secret_update' | vercel env add SECRET development

# full rotation example
(echo 'y' | vercel env rm SECRET development) ; echo $?; ( echo -n $(date -u +"%Y-%m-%dT%H:%M:%SZ") | vercel env add SECRET development); echo $?;

# and pull all dev env vars to file for `vercel dev` and `next dev`
vercel env pull .env.local
```

## Charting

- [React/D3 Chart review](https://dev.to/giteden/top-5-react-chart-libraries-for-2020-1amb)
  - [Nivo](https://nivo.rocks/line/)
  - [Swizec - d3blackbox](https://github.com/Swizec/d3blackbox)

## References

- [HTML entities](https://www.toptal.com/designers/htmlarrows/symbols/)

## Creative Common Attribution

I used 2 icons (svg_ from *The nouns project* which require this attribution:

- [Check by iconcheese from the Noun Project](https://thenounproject.com/term/check/2422594/)
- [reset by Roberto Chiaveri from the Noun Project](https://thenounproject.com/term/reset/299645/)
