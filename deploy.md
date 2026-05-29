# Deployment Guide (Free)

## Frontend — Vercel (Free)

1. Push project ke GitHub
2. Login di https://vercel.com
3. Klik **"Add New Project"** → import repository
4. Configure:
   - **Root Directory:** `frontend/`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Set Environment Variables:
   - `VITE_API_URL` → URL backend setelah deploy (contoh: `https://lokerkupy-api.onrender.com`)
6. Klik **Deploy**

## Backend — Render.com (Free)

1. Push project ke GitHub
2. Login di https://render.com
3. Klik **"New Web Service"** → connect repository
4. Configure:
   - **Name:** `lokerkupy-api`
   - **Root Directory:** `backend/`
   - **Runtime:** `Go`
   - **Build Command:** `go build -o server ./cmd/server/main.go`
   - **Start Command:** `./server`
   - **Plan:** Free ($0/month)
5. Add Environment Variables:
   - `PORT=8080`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
   - `FIREBASE_DATABASE_URL` (opsional, kosongkan untuk local JSON storage)
6. Set **Health Check Path:** `/api/health`
7. Klik **Create Web Service**

## Alternatif Backend Gratis

- **Railway.app** — `railway.app` (free $5 credit, no credit card)
- **Fly.io** — `fly.io` (free 3 VMs)
- **Koyeb** — `koyeb.com` (free tier with Docker)
