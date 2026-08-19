# Monday Morning GM

A "Spotify Wrapped"-style recap for your fantasy football season. Enter a Sleeper league ID and get an animated story of season insights — best drafter, best decision maker, trade activity, and more — built from real league data.

**Live demo:** https://monday-morning-gm.vercel.app

## How it works

1. Enter a Sleeper league ID on the welcome screen.
2. The app validates it and fetches league data from [mmgm-api](https://github.com/camboucher/mmgm-api), the backend that talks to Sleeper and computes the season insights.
3. Results play back as a series of animated, swipeable insight cards.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- Framer Motion for the story transitions
- Recharts for in-story data viz

## Local development

```bash
yarn install
yarn start
```

Requires an `API_URL` environment variable pointing at a running [mmgm-api](https://github.com/camboucher/mmgm-api) instance.
