# Quick Start Guide

## 🚀 Test Locally (Right Now)

```bash
cd C:\Users\yohei\Projects\02_CODY_System\ai-talk-battle
npm run dev
```

Then open: http://localhost:3000

Or double-click: `start.bat`

## 🌐 Deploy to Vercel (5 minutes)

### Method 1: GitHub + Vercel Dashboard (Easiest)

1. **Create GitHub repo**
   - Go to github.com/new
   - Name it `ai-talk-battle`
   - Create repository

2. **Push code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-talk-battle.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variable:
     - Name: `GEMINI_API_KEY`
     - Value: `AIzaSyALYbTnukYRmnI-7c21U9bAT5AtHlvqsPE`
   - Click "Deploy"

4. **Done!** You'll get a URL like: `ai-talk-battle.vercel.app`

### Method 2: Vercel CLI

```bash
vercel login
vercel --prod
```

## ✅ Build Check

Already tested - build passes! ✅

```bash
npm run build
```

## 📱 Test It

1. Pick two characters
2. Choose a mode
3. Enter a topic (e.g., "猫と犬どっちがいいか")
4. Watch them battle!

## 🎯 What to Expect

- 10 rounds of conversation
- Real-time streaming messages
- LINE-style chat bubbles
- Share button at the end

## 📝 Files Created

- All source code in `app/`, `components/`, `data/`
- `.env.local` with API key
- `README.md`, `DEPLOY.md`, `PROJECT_SUMMARY.md`
- Ready to deploy!

---

**Project Location**: `C:\Users\yohei\Projects\02_CODY_System\ai-talk-battle`

**Next Action**: Deploy to Vercel and share the URL!
