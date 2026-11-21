# Itinerarium backend

Express 5 / TypeScript API with MongoDB (Mongoose), JWT authentication, uploads and Socket.IO updates.

Follow the [root setup guide](../README.md#local-development) to create `backend/.env`, choose a database and set a JWT secret before running the service.

Run inside `backend/`:

```bash
npm ci
npm run dev
```

Checks: `npm run build`, `npm test -- --runInBand`, and `npm run lint`.
The test suite includes temporary MongoDB instances. Existing test failures must be recorded rather than treating the old coverage report as current evidence.

Source modules: `src/controllers`, `src/services`, `src/models`, `src/routes`, `src/middlewares`, `src/websocket`, and `src/__tests__`.

See [project provenance](../PROVENANCE.md).
