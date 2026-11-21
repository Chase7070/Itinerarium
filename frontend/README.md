# Itinerarium frontend

Next.js 15 / React 19 / TypeScript frontend with React Leaflet, Tailwind CSS, Axios, React Context and Socket.IO.

Follow the [root setup guide](../README.md#local-development) to create `frontend/.env.local` from `.env.example` and start the backend.

Run inside `frontend/`:

```bash
npm ci
npm run dev -- --port 7392
```

Open http://localhost:7392. Location search requires your own OpenRouteService key. Client environment variables are browser-visible.

Check types with `npx tsc --noEmit`, lint with `npx eslint .`, and build with `npm run build`. The inherited build configuration skips type/lint errors. No frontend test script is configured.

See [project provenance](../PROVENANCE.md).
