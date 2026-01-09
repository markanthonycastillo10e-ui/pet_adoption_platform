# Backend run instructions

This backend can serve the frontend and API on the same origin.

Prerequisites
- Node.js installed
- MongoDB accessible (local or remote). You can use MongoDB Compass to get a connection string.

Environment
- Copy `.env.example` to `.env` and set `MONGODB_URI` and optionally `PORT`.

Start
```bash
cd backend
npm start
```

Notes
- The server serves the `frontend/` folder from the project root. Visit `http://localhost:3000` after starting.
- Health check: `GET /api/health` returns DB connection status.
- If your frontend still contains hardcoded `http://localhost:3000` or `:5000` calls, an inline fetch-rewrite script is included in `frontend/index.html` to reroute requests to the running origin.

Google Cloud Run (build from this repo)

1. Make sure your code is pushed to a Git repository.
2. Create a MongoDB Atlas cluster and get a connection string (or make your MongoDB accessible remotely). Set `MONGO_URI` to that string.
3. Build and push the container image (or let Cloud Build do it):

```bash
# from project root
gcloud builds submit --tag gcr.io/PROJECT-ID/pet-adoption-backend backend
gcloud run deploy pet-adoption-backend --image gcr.io/PROJECT-ID/pet-adoption-backend --region=us-central1 --platform=managed --allow-unauthenticated --set-env-vars MONGO_URI="<your-mongo-uri>",PORT="8080"
```

4. After deployment, your service URL will be printed by `gcloud run deploy`. Visit it — the backend serves the frontend static files and API on the same origin.

Notes:
- Cloud Run requires your database to be reachable from the public internet (use Atlas or a cloud-hosted MongoDB). Local `mongod` accessed only by Compass on your machine will not be reachable by Cloud Run.
- Use the health endpoint (`/api/health`) to verify DB connectivity.

