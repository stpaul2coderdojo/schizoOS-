# Deploying Vayu Vaidya • Wallmiki to Render (Render.com)

*A complete production deployment and clinical infrastructure guide by Vayu Vaidya (Milwaukee, WI / www.vayuvaidya.info), directed by Dr. Bheemaiah Anil K.*

---

## 🌐 Overview

**Render** is a modern cloud hosting platform that simplifies deploying full-stack web applications, Docker containers, and background services with automated zero-downtime deploys, free managed SSL certificates, and global CDN caching.

This guide walks you through deploying **Vayu Vaidya • Wallmiki** to Render using either:
1. **Render Blueprint (`render.yaml`)** *(Fastest & Recommended)*
2. **Render Docker Web Service** *(Standard Multi-Stage Container)*
3. **Render Native Node.js Web Service** *(Direct Node 20 runtime)*

---

## 🚀 Method 1: Deploy with Render Blueprint (`render.yaml`)

We provide a pre-configured `render.yaml` blueprint in the root directory.

### Step 1: Push Code to GitHub / GitLab
Ensure your project is pushed to a remote GitHub or GitLab repository:
```bash
git add .
git commit -m "Configure Render deployment blueprint"
git push origin main
```

### Step 2: Create a Blueprint Instance on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right corner and select **Blueprint**.
3. Connect your GitHub/GitLab account and select your `vayu-vaidya-wallmiki` repository.
4. Render will automatically detect `render.yaml`.
5. Name your Blueprint instance (e.g. `vayu-vaidya-production`).
6. Under **Environment Variables**, provide your **`GEMINI_API_KEY`** (obtained from [Google AI Studio](https://aistudio.google.com/)).
7. Click **Apply**. Render will automatically build the multi-stage Docker container and deploy the service.

---

## 🔑 If Render Didn't Ask for the Gemini Key (Add in 30 Seconds)

If Render did not prompt you for the `GEMINI_API_KEY` during setup, this happens if:
* You clicked **"New + → Web Service"** instead of **"Blueprint"** (Web Services ignore `render.yaml` and do not auto-prompt for custom keys).
* Or you clicked **"Apply"** on the Blueprint overview before filling the secret input.
* Or the service was previously created or synced.

**To add or update `GEMINI_API_KEY` right now:**
1. Open your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click on your deployed web service: **`vayu-vaidya-wallmiki`**.
3. In the left-hand sidebar menu, click **Environment** (or **Environment Variables**).
4. Click **Add Environment Variable** (or edit `GEMINI_API_KEY` if listed):
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *[Paste your Gemini API key from Google AI Studio, e.g. `AIzaSy...`]*
5. Click **Save Changes**.
6. Render will automatically initiate a rolling zero-downtime redeploy with your key active!

---

## 🐳 Method 2: Deploy as a Manual Docker Web Service

If you prefer creating the service manually through the Render dashboard:

1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the following fields:
   * **Name**: `vayu-vaidya-wallmiki`
   * **Region**: `Oregon (US West)` (or your preferred region: Ohio, Frankfurt, Singapore)
   * **Branch**: `main` (or `master`)
   * **Root Directory**: Leave blank (root)
   * **Runtime**: Select **Docker**
   * **Dockerfile Path**: `./Dockerfile`
   * **Instance Type**: **Free** (or **Starter** for always-on clinical production)
4. Scroll down to **Environment Variables** and add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `3000` | Ingress port matching `EXPOSE 3000` |
   | `GEMINI_API_KEY` | `AIzaSy...` | Secret key from Google AI Studio |
5. Click **Create Web Service**.
6. Render will run `docker build`, execute Vite compilation and `esbuild` server bundling, and launch `node dist/server.cjs`.

---

## ⚡ Method 3: Deploy as a Native Node.js Web Service

If you prefer deploying directly on Render's bare Node.js runtime without Docker:

1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository.
3. Configure the service:
   * **Runtime**: **Node**
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
4. Add Environment Variables:
   * `NODE_ENV` = `production`
   * `PORT` = `3000`
   * `GEMINI_API_KEY` = `your_gemini_api_key`
5. Click **Create Web Service**.

---

## 🎙️ Connecting Your Amazon Alexa Skill to Render

Once deployed, Render provides a secure HTTPS URL:
`https://vayu-vaidya-wallmiki.onrender.com`

You can connect your **Alexa Skill** directly to this URL without requiring AWS Lambda:

1. Open the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask).
2. Select **Vayu Vaidya Wallmiki** -> **Endpoint**.
3. Select **HTTPS** (instead of AWS Lambda ARN).
4. Enter your Render URL with the `/api/alexa` path:
   ```
   https://vayu-vaidya-wallmiki.onrender.com/api/alexa
   ```
5. In the SSL certificate dropdown, select:
   > *"My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"*
6. Click **Save Endpoints**.
7. Test in the Alexa **Test** tab:
   * Type: `"open vayu vaidya"` or `"ask vayu vaidya for a breathing exercise"`.

---

## 🌐 Configuring Custom Domains (e.g. `vayuvaidya.info`)

To link your official domain (`www.vayuvaidya.info`) to your Render service:

1. In your Render Web Service dashboard, navigate to **Settings** -> **Custom Domains**.
2. Click **Add Custom Domain**.
3. Enter `www.vayuvaidya.info` and `vayuvaidya.info`.
4. In your DNS provider (e.g. GoDaddy, Namecheap, Route 53, Cloudflare):
   * For `www.vayuvaidya.info`: Add a **CNAME** record pointing to `vayu-vaidya-wallmiki.onrender.com`.
   * For root `vayuvaidya.info`: Add an **A** or **ALIAS/ANAME** record pointing to Render's IP address (displayed in the Render dashboard).
5. Render will automatically issue and renew a free **Let's Encrypt SSL/TLS certificate**.

---

## 🩺 Verification & Health Monitoring

Verify the live deployment by checking the health endpoint:
```bash
curl -i https://vayu-vaidya-wallmiki.onrender.com/api/health
```

Expected JSON Response:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "botName": "Wallmiki",
  "platform": "Docker Container",
  "timestamp": "2026-09-20T12:00:00.000Z"
}
```

### Preventing Cold Starts on Free Tier
Render's Free tier services spin down after 15 minutes of inactivity. For non-stop availability:
* **Option A**: Upgrade the service instance to **Starter** ($7/mo) in the Render dashboard for persistent CPU/RAM and zero cold starts.
* **Option B**: Set up a free external ping monitor (such as [UptimeRobot](https://uptimerobot.com/) or cron job) sending an HTTP `GET` request to `https://vayu-vaidya-wallmiki.onrender.com/api/health` every 10 minutes.
