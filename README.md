# MiMo Website

Single-page React site for the MiMo student game project.

## Setup

```bash
npm install
npm run dev
```

## Configuration

Edit `src/config.js` to set:

- `GAMEPLAY_YOUTUBE_ID` — YouTube video ID for the gameplay section

Use the video ID only (the part after `v=` in a YouTube URL), not the full URL.

## Routes

- `/home` — main scrollable page
- `/play` — full-screen Unity WebGL game (no site chrome or background audio)
- `/devlog` — placeholder
- `/gdd` — placeholder

## Unity build

Place WebGL build files in `public/Build/`. The play page expects:

- `web build 2.loader.js`
- `web build 2.data.gz`
- `web build 2.framework.js.gz`
- `web build 2.wasm.gz`

If loading fails in the browser, see the comment at the top of `src/pages/PlayPage.jsx`.

### StreamingAssets (FMOD audio)

Copy the `StreamingAssets` folder from your Unity WebGL build output into `public/StreamingAssets/`. Without those `.bank` files, the game may load but audio and some scenes can break.
