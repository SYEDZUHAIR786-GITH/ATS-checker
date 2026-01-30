# 🚀 ATS Resume Checker - SETUP GUIDE

## Complete Installation & Running Instructions

### 📋 Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **MongoDB** (Local or Atlas) ([Setup](https://www.mongodb.com/))
- **Git** for version control

### ⚡ Quick Start (5-10 minutes)

#### Step 1: MongoDB Setup
```bash
# Option A: Local MongoDB
# Install MongoDB Community Edition (https://docs.mongodb.com/manual/installation/)
# Then run:
mongod

# Option B: MongoDB Atlas (Cloud)
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Get connection string: mongodb+srv://...
# 4. Copy for .env file
```

#### Step 2: Backend Setup (Node.js + Express)
```bash
cd /Users/zuhairshah/Documents/Ats-checker/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add:
# MONGODB_URI=mongodb://localhost:27017/ats-checker
# PORT=5000
# ML_SERVICE_URL=http://localhost:8000

# Start backend (Terminal 1)
npm run dev
# Expected: "Server running on port 5000"
```

#### Step 3: ML Service Setup (Python FastAPI)
```bash
cd /Users/zuhairshah/Documents/Ats-checker/ml-service

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR on Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model (first time only)
python -m spacy download en_core_web_sm

# Start ML service (Terminal 2)
python main.py
# Expected: "Application startup complete"
# Swagger docs: http://localhost:8000/docs
```

#### Step 4: Frontend Setup (React)
```bash
cd /Users/zuhairshah/Documents/Ats-checker/client

# Install dependencies
npm install

# Start frontend (Terminal 3)
npm start
# Expected: Opens http://localhost:3000
```

---

## 📊 Running All Three Services

You'll need **3 Terminal windows** open simultaneously:

### Terminal 1: Backend (Node.js)
```bash
cd /Users/zuhairshah/Documents/Ats-checker/server
npm run dev
```
✅ Should print: `Server running on port 5000`

### Terminal 2: ML Service (Python)
```bash
cd /Users/zuhairshah/Documents/Ats-checker/ml-service
source venv/bin/activate
python main.py
```
✅ Should print: `Application startup complete`

### Terminal 3: Frontend (React)
```bash
cd /Users/zuhairshah/Documents/Ats-checker/client
npm start
```
✅ Should open browser: `http://localhost:3000`

---

## ✅ Testing the Application

### 1. **Test Health Endpoints**
```bash
# Backend health
curl http://localhost:5000/api/health

# ML Service health
curl http://localhost:8000/api/health
```

### 2. **Test Resume Upload**
- Go to http://localhost:3000
- Upload a sample resume (PDF/DOCX)
- Paste a job description
- Click "Analyze Resume"

### 3. **View Results**
- Check ATS score, matched/missing skills
- View suggestions

### 4. **Check Dashboard**
- Go to /dashboard
- View all analyses and statistics

---

## 🔧 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ats-checker
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### ML Service (No .env needed, uses defaults)
- Port: 8000
- Host: 0.0.0.0

---

## 🐛 Troubleshooting

### Issue: "Connection refused" at MongoDB
**Solution:**
- Ensure MongoDB is running: `mongod` or check Atlas credentials
- Update MONGODB_URI in server/.env

### Issue: ML Service not starting
**Solution:**
```bash
# Delete cache and reinstall
cd ml-service
rm -rf __pycache__
pip install --upgrade torch
python main.py
```

### Issue: React app won't load
**Solution:**
```bash
cd client
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: "Port already in use"
**Solution:**
```bash
# Kill process on port
kill -9 $(lsof -t -i :5000)  # Backend
kill -9 $(lsof -t -i :8000)  # ML Service
kill -9 $(lsof -t -i :3000)  # Frontend
```

---

## 📦 Dependencies Overview

### Backend (Node.js)
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `multer` - File upload
- `axios` - HTTP client for ML service
- `pdfparse` - PDF text extraction
- `mammoth` - DOCX text extraction

### ML Service (Python)
- `fastapi` - API framework
- `sentence-transformers` - BERT embeddings
- `spacy` - NLP & NER
- `scikit-learn` - Machine learning utils
- `torch` - Deep learning (dependency)

### Frontend (React)
- `react-router-dom` - Routing
- `axios` - API calls
- `react-toastify` - Notifications
- `tailwindcss` - Styling

---

## 🎯 API Flow Example

```
1. User uploads resume.pdf + job_description.txt
   ↓
2. Frontend sends multipart form to: POST /api/score/analyze
   ↓
3. Backend extracts text using PyPDF2/mammoth
   ↓
4. Backend calls ML Service: POST /api/analyze
   ↓
5. ML Service (Python):
   - Loads BERT model
   - Extracts skills (spaCy NER)
   - Calculates cosine similarity
   - Generates suggestions
   ↓
6. Backend saves to MongoDB
   ↓
7. Frontend displays results
```

---

## 🚀 Next Steps

1. ✅ **Install all three services** (Backend, ML, Frontend)
2. ✅ **Run the app** with all terminals open
3. 🧪 **Test with sample resume** (provided in /samples or create your own)
4. 📊 **Check Dashboard** for analytics
5. 🎨 **Customize** skill database in ml-service/main.py
6. 🌐 **Deploy** (See Deployment Guide below)

---

## 🌐 Deployment (Optional)

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy 'build' folder to Vercel/Netlify
```

### Backend (Railway/Render)
```bash
cd server
git push  # Push to GitHub
# Connect repo to Railway/Render
# Set environment variables in dashboard
```

### ML Service (Railway/Heroku)
```bash
cd ml-service
# Create Procfile with: web: python main.py
git push
```

---

## 📚 Resources

- [BERT Documentation](https://huggingface.co/sentence-transformers)
- [spaCy NER Guide](https://spacy.io/usage/linguistic-features#named-entities)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [MERN Stack Guide](https://www.mongodb.com/mern-stack)

---

## ✨ Features Overview

### ✅ Implemented
- Resume PDF/DOCX upload
- Job description text input
- BERT semantic similarity
- spaCy NER skill extraction
- ATS scoring (0-100)
- Match percentage calculation
- MongoDB history storage
- React dashboard
- Real-time results

### 🚀 Future Enhancements
- User authentication
- Resume templates
- Advanced analytics
- Email notifications
- API documentation (Swagger)
- Docker containerization

---

**Happy analyzing! 🎉**

For issues or questions, check the main README.md or create an issue on GitHub.
