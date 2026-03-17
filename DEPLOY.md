# Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push to GitHub:
```bash
# Create a new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-talk-battle.git
git branch -M main
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyALYbTnukYRmnI-7c21U9bAT5AtHlvqsPE`
6. Click "Deploy"

## Option 2: Deploy via Vercel CLI

```bash
# Login first
vercel login

# Then deploy
vercel --prod
```

When prompted, add the environment variable `GEMINI_API_KEY`.

## Testing Locally

```bash
npm run dev
```

Open http://localhost:3000

## Build Check

```bash
npm run build
```

Build completed successfully ✓
