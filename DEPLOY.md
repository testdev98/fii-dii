# Deployment Guide

## Render.com (Recommended)

### Static Site Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create Static Site on Render**
- Go to https://dashboard.render.com/
- Click "New +" → "Static Site"
- Connect your GitHub repository
- Configure:
  - **Name**: fii-dii-dashboard
  - **Branch**: main
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist`

3. **Deploy**
- Click "Create Static Site"
- Wait 2-3 minutes
- Your app will be live!

## Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite configuration.

## Netlify

1. Build locally:
```bash
npm run build
```

2. Deploy:
- Drag and drop `dist` folder to Netlify
- Or connect GitHub repository

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- ✅ No backend required
- ✅ Pure frontend React app
- ✅ Works without login (demo mode)
- ✅ Login for real broker data
- ✅ Fast deployment
- ✅ Free hosting on Render/Vercel/Netlify

## Troubleshooting

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Port already in use
Vite will automatically use next available port (5174, 5175, etc.)
