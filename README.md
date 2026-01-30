# 🚀 ATS Resume Checker - Complete Documentation

An AI-powered ATS Resume Checker built with MERN stack to help job seekers optimize their resumes for Applicant Tracking Systems.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features Guide](#features-guide)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Features
- **Resume Analysis**: Upload PDF/DOCX resumes and get instant ATS scoring
- **Job Description Analysis**: Extract keywords and skills from job descriptions
- **Professional Scoring**: Get ATS score (0-100), match rate, and missing keywords
- **Skill Matching**: Visual comparison of matched vs missing skills
- **Resume Suggestions**: AI-powered recommendations for improvement
- **Results Export**: Download analysis results as PDF
- **Email Export**: Send results directly to email

### Advanced Features
- **Resume Templates**: 3+ professionally designed, ATS-optimized templates
- **Template Download**: Export templates in multiple formats
- **Resume Comparison**: Compare 2 resumes against the same job description
- **Job Description Analyzer**: Standalone tool to analyze job listings
- **Tips & Guide**: Best practices for ATS optimization
- **Dashboard**: Track analysis history and statistics
- **Dark Mode**: Beautiful dark theme for reduced eye strain

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router 6.16.0
- **HTTP Client**: Axios 1.5.0
- **Styling**: CSS3 (Custom + dark mode)
- **Charts**: Recharts 2.10.3
- **PDF Export**: jsPDF + html2canvas
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js v25.5.0
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 8.2.4
- **ODM**: Mongoose 7.5.0
- **File Upload**: Multer 1.4.5
- **Document Parsing**: pdf-parse, Mammoth (DOCX)
- **Email**: Nodemailer 6.9.7
- **Development**: Nodemon 3.1.11

### ML Service
- **Framework**: FastAPI 0.104.1
- **Python**: 3.10.13
- **ML**: scikit-learn (TF-IDF), spaCy 3.7.2
- **Async**: Uvicorn ASGI server

## 📁 Project Structure

```
Ats-checker/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation component
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Upload & analysis
│   │   │   ├── Results.jsx     # Results display
│   │   │   ├── Dashboard.jsx   # History & stats
│   │   │   ├── Tips.jsx        # ATS tips
│   │   │   ├── Templates.jsx   # Resume templates
│   │   │   ├── JobAnalyzer.jsx # JD analysis
│   │   │   ├── CompareResumes.jsx # Resume comparison
│   │   │   └── [CSS files]
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── public/
│
├── server/                      # Express Backend
│   ├── controllers/
│   │   ├── scoreController.js  # Analysis logic
│   │   └── emailController.js  # Email export
│   ├── models/
│   │   └── Score.js            # MongoDB schema
│   ├── routes/
│   │   └── scoreRoutes.js      # API routes
│   ├── middleware/
│   │   └── fileUpload.js       # Multer config
│   ├── server.js               # Main server
│   ├── .env                    # Environment variables
│   └── package.json
│
├── ml-service/                 # Python ML Service
│   ├── main.py                 # FastAPI app
│   ├── main_simple.py          # Simplified implementation
│   ├── main_bert.py.bak        # Original BERT implementation
│   ├── requirements.txt        # Python dependencies
│   └── venv/                   # Virtual environment
│
└── README.md                   # This file
```

## 🚀 Installation

### Prerequisites
- Node.js v14+ (Tested with v25.5.0)
- Python 3.8+ (Tested with 3.10.13)
- MongoDB 4.4+ (Installed via Homebrew)
- npm 6+

### Step 1: Clone Repository
```bash
cd /Users/zuhairshah/Documents
cd Ats-checker
```

### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd ../server
npm install
```

### Step 4: Setup Python ML Service
```bash
cd ../ml-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 5: Start MongoDB
```bash
brew services start mongodb/brew/mongodb-community
```

## ⚙️ Configuration

### Backend Environment Variables
Create `.env` file in `server/` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ats-checker

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend Environment Variables
Create `.env` file in `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5001
```

## 🏃 Running the Application

### Start All Services

Terminal 1 - ML Service:
```bash
cd ml-service
source venv/bin/activate
python main.py
# Output: 🚀 Starting ML Service on port 8000...
```

Terminal 2 - Backend:
```bash
cd server
npm run dev
# Output: 🚀 Server running on port 5001
```

Terminal 3 - Frontend:
```bash
cd client
npm start
# Output: Compiled successfully! http://localhost:3000
```

### Verify Services
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- ML Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

## 📡 API Documentation

### Resume Analysis
**POST** `/api/score/analyze`
- Upload resume file (PDF/DOCX)
- Requires: `resume` (file), `jobDescription` (text)
- Returns: Analysis results with ID

### Get Analysis Results
**GET** `/api/score/:id`
- Retrieve stored analysis by ID

### Send Results via Email
**POST** `/api/score/send-email`
- Send analysis results to email
- Requires: `id` (analysis ID), `userEmail` (recipient)

## 🎯 Features Guide

### 1. Resume Upload & Analysis
1. Navigate to Home page
2. Click "Choose file" to upload resume (PDF/DOCX)
3. Paste job description in text area
4. Click "🔍 Analyze Resume"
5. View results with scores and recommendations

### 2. Download Results as PDF
- On Results page, click "⬇ Download Results"

### 3. Email Results
```javascript
const emailResults = async () => {
  await axios.post('/api/score/send-email', {
    id: analysisId,
    userEmail: 'recipient@example.com'
  });
};
```

### 4. Use Resume Templates
1. Click "Templates" in navbar
2. Choose from available templates
3. Preview and download

### 5. Compare Resumes
1. Click "Compare" in navbar
2. Upload 2 resumes and job description

### 6. View Analytics Dashboard
1. Click "Dashboard" in navbar
2. See analysis history and statistics

### 7. Enable Dark Mode
- Click moon icon (🌙) in navbar

## ⚡ Performance Optimization

### Frontend Optimizations
1. **Code Splitting**: Lazy load pages using React.lazy()
2. **Memoization**: Use React.memo() to prevent unnecessary re-renders
3. **Bundle Analysis**: Run npm run build
4. **Image Optimization**: Compress images and use WebP format

### Backend Optimizations
1. **Database Indexing**: Create indexes on frequently queried fields
2. **Compression**: Enable gzip compression
3. **Rate Limiting**: Implement API rate limiting
4. **Connection Pooling**: Reuse database connections

### ML Service Optimizations
1. **Model Caching**: Load models once at startup
2. **Batch Processing**: Process multiple requests efficiently
3. **Async Operations**: Use FastAPI async features

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000,5001,8000 | xargs kill -9
```

### MongoDB Connection Failed
```bash
brew services start mongodb/brew/mongodb-community
```

### ML Service Not Responding
```bash
cd ml-service
source venv/bin/activate
pip install -r requirements.txt
```

### CORS Errors
Ensure backend has CORS enabled for frontend origin.

## 📄 License

MIT License - Feel free to use for personal and commercial projects

---

**Last Updated**: January 30, 2026
**Version**: 1.0.0

For more information, visit: [http://localhost:3000](http://localhost:3000)
