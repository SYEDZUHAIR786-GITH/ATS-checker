# Quick Start - Deploy to Vercel in 5 Minutes

## Summary

Your ATS Resume Checker is now ready for Vercel deployment! 🚀

### What Changed

✅ Converted to **Next.js** (Vercel's native framework)  
✅ Created serverless **API routes** for backend  
✅ Created Python **serverless function** for ML analysis  
✅ Ready for **MongoDB Atlas** (cloud database)  
✅ **Zero Docker** needed - pure Vercel serverless

### Two Options

## Option 1: Deploy Now (Recommended)

```bash
# Already pushed to GitHub, just connect Vercel:
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo "ATS-checker"
4. Vercel auto-detects Next.js ✓
5. Add environment variable: MONGODB_URI
6. Click "Deploy" - Done! 🎉
```

**Detailed guide**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

## Option 2: Test Locally First

```bash
# Install dependencies
npm install

# Build
npm run build

# Run production version locally
npm start

# Open http://localhost:3000
```

## Setup MongoDB (Required for Deployment)

Even though analysis works without MongoDB, you need it for saving results:

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to Vercel environment variables as `MONGODB_URI`

**Full MongoDB setup guide**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) Step 1

## Architecture

```
Vercel (Frontend + Backend)
├── Pages/                (React frontend)
├── api/score.js          (Backend API)
├── api/analyze.py        (ML service)
└── MongoDB Atlas         (Database)
```

## Features

✓ Resume analysis (local or with ML service)  
✓ ATS score calculation  
✓ Skill matching  
✓ Suggestions & keywords  
✓ Results saved to database  
✓ Mobile responsive  
✓ Fast & scalable  

## Common Questions

**Q: Will it cost money?**  
A: No! Vercel free tier covers this. MongoDB Atlas free tier is 512MB (enough for testing).

**Q: Can I keep the local setup?**  
A: Yes! Both work:
- Local: `bash RUN_LOCALLY.sh`
- Vercel: Connect GitHub, auto-deploys

**Q: Can I use my own domain?**  
A: Yes! Vercel supports custom domains (Settings → Domains)

**Q: What if the ML service is offline?**  
A: Falls back to basic keyword matching - still works!

---

## Next Steps

1. **Setup MongoDB Atlas** (5 minutes) - See Step 1 in [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
2. **Deploy to Vercel** (1 click) - See Step 3 in [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
3. **Test your live app** - Visit your Vercel URL

**You're ready! 🚀**

For detailed setup: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
