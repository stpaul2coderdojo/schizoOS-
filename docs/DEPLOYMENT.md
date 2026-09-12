# Deployment & GitHub Guide

This guide describes how to deploy **Vayu Vaidya • Wallmiki E-Psychiatrist** to production environments such as **Google Cloud Run**, Docker containers, and how to maintain the repository on **GitHub**.

---

## 1. Environment Variables

The application requires the following environment variables:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | Yes (Default: `3000`) | The network port the Express server binds to. In Cloud Run and container environments, this is routed to port `3000`. |
| `NODE_ENV` | Optional | Set to `production` in live deployments. |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key obtained from [Google AI Studio](https://aistudio.google.com/). If omitted, the application seamlessly activates built-in clinical safe fallbacks. |

Create your `.env` file in the project root:
```env
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=AIzaSy...
```

---

## 2. Local Development & Production Build

### Development Mode
```bash
npm run dev
```
Starts `tsx server.ts` with embedded Vite middleware for instant hot reloading at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Executes two tasks:
1. `vite build`: Compiles the React 19 TypeScript application into optimized static assets in `/dist`.
2. `esbuild`: Bundles `server.ts` into a standalone CommonJS file at `dist/server.cjs` with sourcemaps.

### Production Run
```bash
npm start
```
Directly launches `node dist/server.cjs`.

---

## 3. Docker Containerization

Below is a production-grade multi-stage `Dockerfile` optimized for minimal image size and fast cold starts:

```dockerfile
# Stage 1: Build Frontend and Server
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

# Copy build artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

### Build and Run Docker Image:
```bash
docker build -t wallmiki-e-psychiatrist:latest .
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" wallmiki-e-psychiatrist:latest
```

---

## 4. Google Cloud Run Deployment

Google Cloud Run provides auto-scaling, scale-to-zero economics, and integrated HTTPS certificates.

### Deploy via Google Cloud CLI (`gcloud`):
```bash
# Set your GCP Project ID
gcloud config set project YOUR_PROJECT_ID

# Build and deploy directly to Cloud Run
gcloud run deploy wallmiki-e-psychiatrist \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars "NODE_ENV=production,GEMINI_API_KEY=your_key_here"
```

---

## 5. Exporting and Pushing to GitHub

If you are using Google AI Studio Build or working in a local workspace, you can easily export or push your code to your GitHub repository:

### Method A: Direct Git Push
1. Initialize git in your project directory (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Vayu Vaidya Wallmiki E-Psychiatrist"
   ```

2. Add your GitHub remote repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   ```

3. Push to GitHub:
   ```bash
   git push -u origin main
   ```

### Method B: Google AI Studio Settings Export
In the Google AI Studio top-right settings menu:
1. Click **Export to GitHub**.
2. Authorize your GitHub account.
3. Select your repository name (new or existing) and branch.
4. Click **Confirm Export**.

---

## 6. Verification and Health Check

Once deployed, confirm your service is operating properly:
```bash
curl -i https://<your-service-domain>/api/health
```
Expected response:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "botName": "Wallmiki",
  "timestamp": "2026-09-12T09:22:15.000Z"
}
```
