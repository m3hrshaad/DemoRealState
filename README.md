# Real Estate Frontend Demo (Frontend Only)

This package runs the React/Vite frontend without starting the Node.js backend or connecting to PostgreSQL.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Sample admin login

- URL: `/admin/login`
- Email: `admin@amlak.local`
- Password: `admin1234`

## How demo data works

- `frontend/src/data/mock-data.json` contains sample properties, team members, services, and site settings based on the original backend seed data.
- `frontend/src/lib/api.ts` implements the frontend demo API. It handles public listings, property details, admin pages, inquiries, and sample login without HTTP requests.
- Changes made in the admin panel are stored in the browser's `localStorage` under `amlak-frontend-demo-v1`.
- Image upload is simulated by selecting a bundled sample image. It does not upload files to a server.
- To restore the original sample data, clear the browser's localStorage key `amlak-frontend-demo-v1` and refresh the page.

This is a frontend prototype only. Login and stored data are not secure and must not be used as a production backend.
