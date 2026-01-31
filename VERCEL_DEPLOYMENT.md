# Deploy to Vercel - Complete Guide

This guide shows how to deploy the ATS Resume Checker to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Link your repository to Vercel
3. **MongoDB Atlas Account**: Create a free MongoDB database at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

## Step 1: Setup MongoDB Atlas (Database)

MongoDB Atlas provides free cloud MongoDB hosting:

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project called "ATS-Checker"
4. Create a cluster (free tier available)
5. Configure network access:
   - Add IP address: `0.0.0.0/0` (allow from anywhere)
6. Create database user:
   - Username: `atsuser`
   - Password: Generate secure password
7. Get connection string:
   - Click "Connect"
   - Choose "Drivers"
   - Copy MongoDB connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://atsuser:PASSWORD@cluster.mongodb.net/ats-checker`

## Step 2: Push to GitHub

Make sure your changes are pushed:

```bash
git add -A
git commit -m "Convert to Next.js for Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Select your GitHub repo `ATS-checker`
5. Configure project:
   - Framework: **Next.js**
   - Root Directory: `.` (root)
6. Add Environment Variables:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string (from Step 1)
7. Click "Deploy"

Vercel will automatically build and deploy!

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/zuhairshah/Documents/Ats-checker
vercel

# Follow prompts:
# - Link to Vercel account
# - Select project name
# - Add environment variables when prompted

# Add MongoDB URI:
vercel env add MONGODB_URI
# Paste your MongoDB connection string
```

## Step 4: Add Environment Variables in Vercel

After deployment, go to your Vercel project dashboard:

1. Go to "Settings"
2. Click "Environment Variables"
3. Add:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string
4. Save and redeploy

## Step 5: Verify Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://ats-checker-xyz.vercel.app`)
2. Paste resume and job description
3. Click "Analyze Resume"
4. Check if results appear

## Troubleshooting

### "Cannot find module" errors
- Make sure `package.json` has all dependencies
- Redeploy: `vercel --prod`

### API not working
- Check MongoDB URI is correct in Environment Variables
- Make sure IP `0.0.0.0/0` is allowed in MongoDB Atlas

### Slow responses
- First request takes longer (cold start)
- MongoDB Atlas might need to wake up
- Be patient, it will improve

### Database connection issues
- Verify connection string format
- Check username and password are correct
- Ensure database user has proper permissions

## Local Testing Before Deployment

Test locally first:

```bash
# Install dependencies
npm install

# Build
npm run build

# Run production build locally
npm run start
```

Then visit `http://localhost:3000`

## Environment Variables Reference

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Should be `production` on Vercel | `production` |

## Updating Your Deployment

Changes to `main` branch automatically redeploy:

```bash
# Make changes locally
git add -A
git commit -m "Your changes"
git push origin main

# Vercel automatically redeploys!
```

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] GitHub repo connected to Vercel
- [ ] Environment variables added
- [ ] Initial deployment successful
- [ ] API endpoints responding
- [ ] Analysis working end-to-end

## Costs

- **Vercel**: Free tier includes generous serverless limits
- **MongoDB Atlas**: Free tier includes 512MB storage (enough for testing)
- **No hidden costs**: Scale automatically

## Custom Domain (Optional)

To add your own domain:

1. In Vercel dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow DNS instructions from your registrar

---

**That's it!** Your ATS Resume Checker is now running on Vercel 🚀
