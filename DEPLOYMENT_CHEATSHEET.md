# Deployment Cheat Sheet

## 🚀 Deploy in 3 Steps

### Step 1️⃣ Database Setup (5 min)
```bash
# Go to: https://mongodb.com/cloud/atlas
# 1. Sign up (free)
# 2. Create cluster
# 3. Copy connection string
# Save: mongodb+srv://user:pass@cluster.mongodb.net/ats-checker
```

### Step 2️⃣ Vercel Deploy (1 min)
```bash
# Go to: https://vercel.com
# 1. Click "New Project"
# 2. Import "ATS-checker" repo from GitHub
# 3. Add environment variable:
#    Name: MONGODB_URI
#    Value: [Your connection string from Step 1]
# 4. Click "Deploy"
```

### Step 3️⃣ Done! 🎉
```bash
# Visit your live app:
# https://[your-project].vercel.app
```

---

## 📚 Documentation

| Guide | Duration | For Who |
|-------|----------|---------|
| [START_HERE.md](START_HERE.md) | 2 min | Overview |
| [VERCEL_QUICK_START.md](VERCEL_QUICK_START.md) | 5 min | Quick setup |
| [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | 15 min | Detailed steps |
| [LOCAL_SETUP.md](LOCAL_SETUP.md) | 10 min | Local dev |

---

## 🏠 Local Development

```bash
# Run everything locally (no Vercel needed)
bash RUN_LOCALLY.sh

# Stop services
bash STOP_LOCAL.sh

# Opens at: http://localhost:3000
```

---

## 🔧 Environment Variables

Only needed for Vercel:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│         VERCEL SERVERLESS           │
├─────────────────────────────────────┤
│  Frontend                           │
│  (Next.js React pages)              │
├─────────────────────────────────────┤
│  API Routes                         │
│  • /api/score    (Node.js)          │
│  • /api/analyze  (Python)           │
├─────────────────────────────────────┤
│  Database                           │
│  (MongoDB Atlas - Cloud)            │
└─────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Read [START_HERE.md](START_HERE.md)
- [ ] Create MongoDB Atlas account
- [ ] Get MongoDB connection string
- [ ] Go to vercel.com
- [ ] Connect GitHub repo
- [ ] Add MONGODB_URI env var
- [ ] Click Deploy
- [ ] Visit live app
- [ ] Test resume analysis

---

## 🆘 Troubleshooting

### Analysis not working?
→ Check MONGODB_URI in Vercel Settings  
→ Ensure IP 0.0.0.0/0 is allowed in MongoDB Atlas

### Slow first request?
→ Normal! Serverless cold start = 2-3 sec  
→ Subsequent requests are instant

### Want to develop locally?
→ Run `bash RUN_LOCALLY.sh`

### Need to rebuild?
→ Just push to GitHub, Vercel auto-deploys

---

## 💰 Cost

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | Generous free tier |
| MongoDB Atlas | Free | 512MB storage (enough!) |
| Domain (optional) | $12/yr | Custom domain only |
| **Total** | **$0** | Free to start! |

---

## 🎯 What's Different?

| Aspect | Old | New |
|--------|-----|-----|
| Hosting | Local/Docker | Vercel cloud |
| Database | Local MongoDB | MongoDB Atlas |
| Deployment | Manual | Auto on git push |
| Framework | React/Express/FastAPI | Next.js serverless |
| Complexity | High | Low |

---

## 📱 Features

✅ Resume upload/paste  
✅ Job description input  
✅ ATS score calculation  
✅ Skill matching  
✅ Missing skills alert  
✅ Improvement suggestions  
✅ Keyword extraction  
✅ Mobile responsive  
✅ Results saved  
✅ Fast & scalable  

---

**Ready?** Start with [START_HERE.md](START_HERE.md) 🚀
