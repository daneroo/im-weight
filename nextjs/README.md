# Next.js branch of im-weight

*Note: 2025-01-26: Upgraded to node v22.x* in project settings on Vercel, and added `NODE_OPTIONS='--openssl-legacy-provider'` to package.json

 Deployed to <https://weight.v.imetrical.com/>

## Upgrading from Next.js 9.3.5 and React 16.13.1

```bash
# 1. First, analyze current setup
git checkout -b pre-upgrade-backup  # Created backup branch
npx @next/codemod list  # Shows available transformations:
# - add-missing-react-import (needed for React 17+)
# - new-link (for newer Next.js versions)
# - next-image-to-legacy-image (if we use next/image)
# - and more...

# 3. Planned upgrade path:
# Step 1: Next.js 12 + React 17
#   - Apply add-missing-react-import codemod
#   - Update dependencies
#   - Test locally
#   - Deploy to Vercel

# Step 2: UI libraries
#   - Update @nivo/line
#   - Update react-spring
#   - Update react-use-gesture
#   - Test visualizations and animations

# Step 3: Next.js 13/14 + React 18
#   - Apply new-link codemod
#   - Apply image codemods if needed
#   - Update to React 18
#   - Test and deploy
```

## TODO

- Build on push from Next.js
  - Push creds replaced by vercel secrets (run/build?)
  - Incremental static build
- Get a favicon on next.js
- Upgrade to next.js v11
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

Actual AWS S3 key is generated and rotated from `../s3`.

Credentials are pushed to [Vercel environement variables](https://vercel.com/daneroo/weight/settings/environment-variables).

There are three environments: development, preview, and production.

So for local development, the credentials are pulled back in to `.env.local`

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
