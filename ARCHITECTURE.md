# 🏗️ Architecture & Technical Documentation

## System Overview

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       ↓
┌──────────────────────┐
│  Frontend (React)    │
│  - Home (Upload)     │
│  - Results (Display) │
│  - Dashboard (Stats) │
└──────┬───────────────┘
       │ REST API (port 3000→5000)
       ↓
┌─────────────────────────────┐
│  Backend (Express.js)       │
│  - File Upload Handler      │
│  - Text Extraction (PDF/    │
│    DOCX)                    │
│  - API Routes               │
│  - Database Connection      │
└──────┬──────────────────────┘
       │ HTTP POST (port 5000→8000)
       ↓
┌────────────────────────┐
│ ML Service (FastAPI)   │
│ - BERT Embeddings      │
│ - spaCy NER            │
│ - Similarity Scoring   │
│ - Skill Extraction     │
└──────┬─────────────────┘
       │
       ↓
┌────────────────────────┐
│  Database (MongoDB)    │
│  - Resume Collection   │
│  - Analysis History    │
│  - Statistics          │
└────────────────────────┘
```

## Technology Stack Details

### Frontend (React)
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP**: Axios
- **Styling**: CSS3 + Tailwind concepts
- **State**: React Hooks
- **Notifications**: React Toastify
- **Port**: 3000

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **File Handling**: Multer
- **PDF Parser**: pdfparse
- **DOCX Parser**: Mammoth
- **HTTP Client**: Axios
- **Port**: 5000

### ML Service (Python)
- **Framework**: FastAPI
- **Server**: Uvicorn
- **NLP Models**: 
  - Sentence Transformers (BERT)
  - spaCy (NER)
- **ML Library**: Scikit-learn
- **Deep Learning**: PyTorch
- **Port**: 8000

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - Node.js ODM
- **Connection**: Mongoose + MongoDB

---

## Data Flow & Processing Pipeline

### Resume Upload & Analysis Flow

```json
{
  "request": {
    "method": "POST",
    "endpoint": "/api/score/analyze",
    "body": {
      "resume": "binary_file",
      "jobDescription": "string"
    }
  },
  "processing": {
    "step_1": "File received at server",
    "step_2": "File saved to disk",
    "step_3": {
      "pdf": "pdfparse extracts text",
      "docx": "mammoth extracts text"
    },
    "step_4": "Resume text sent to ML service",
    "step_5": {
      "bert": "Generate embeddings for resume & JD",
      "similarity": "Cosine similarity calculation",
      "ner": "Extract entities (skills, experience)",
      "keywords": "Extract top keywords (TF-IDF)"
    },
    "step_6": "ML service returns results",
    "step_7": "Backend saves to MongoDB",
    "step_8": "Response sent to frontend"
  },
  "response": {
    "resumeId": "MongoDB ObjectId",
    "data": {
      "atsScore": 85.5,
      "matchPercentage": 78.3,
      "matchedSkills": ["Python", "ML"],
      "missingSkills": ["TensorFlow"],
      "suggestions": ["Add TensorFlow experience"],
      "keywords": ["Python", "ML", "Data"]
    }
  }
}
```

---

## Database Schema (MongoDB)

### Resume Collection
```javascript
{
  _id: ObjectId,
  fileName: String,           // "resume.pdf"
  fileUrl: String,           // "/uploads/12345.pdf"
  textContent: String,       // Extracted resume text
  jobDescription: String,    // Pasted JD text
  
  // Analysis Results
  atsScore: Number,          // 0-100
  matchPercentage: Number,   // 0-100%
  matchedSkills: [String],   // ["Python", "ML"]
  missingSkills: [String],   // ["TensorFlow", "NLP"]
  suggestions: [String],     // Improvement tips
  keywords: [String],        // Top keywords
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

---

## ML Model Architecture

### 1. Semantic Similarity (BERT)
```python
resume_embedding = model.encode(resume_text)
jd_embedding = model.encode(job_description)
similarity = cosine_similarity(resume_embedding, jd_embedding)
ats_score = similarity * 100  # 0-100
```

### 2. Skill Extraction (spaCy NER + Database)
```python
# Step 1: Rule-based matching
found_skills = [s for s in SKILLS_DB if s.lower() in text.lower()]

# Step 2: NER-based extraction
doc = nlp(text)
named_entities = [ent.text for ent in doc.ents]

# Result
matched_skills = set(found_skills) & set(jd_skills)
missing_skills = set(jd_skills) - set(matched_skills)
```

### 3. Keyword Extraction (TF-IDF)
```python
# Tokenize and filter stopwords
words = tokenize(text)
words = [w for w in words if w not in STOPWORDS]

# Frequency-based ranking
freq = Counter(words)
top_keywords = freq.most_common(10)
```

---

## API Endpoints Reference

### Score Analysis
```
POST /api/score/analyze
Content-Type: multipart/form-data
Body: {
  resume: File,
  jobDescription: String
}
Response: {
  success: Boolean,
  resumeId: String,
  data: { atsScore, matchPercentage, ... }
}
```

```
POST /api/score/score-text
Content-Type: application/json
Body: {
  resumeText: String,
  jobDescription: String
}
Response: {
  success: Boolean,
  resumeId: String,
  data: { atsScore, matchPercentage, ... }
}
```

```
GET /api/score/:id
Response: {
  success: Boolean,
  data: { // Full resume document }
}
```

### History Management
```
GET /api/history
Response: {
  success: Boolean,
  data: [{ resume_1 }, { resume_2 }, ...]
}
```

```
GET /api/history/stats/summary
Response: {
  success: Boolean,
  data: {
    totalAnalyzed: Number,
    averageAtsScore: Number,
    averageMatchPercentage: Number
  }
}
```

```
DELETE /api/history/:id
Response: {
  success: Boolean,
  message: "Analysis deleted"
}
```

### ML Service
```
POST /api/analyze (Python FastAPI)
Content-Type: application/json
Body: {
  resume_text: String,
  job_description: String
}
Response: {
  ats_score: Number,
  match_percentage: Number,
  matched_skills: [String],
  missing_skills: [String],
  suggestions: [String],
  keywords: [String]
}
```

---

## Error Handling & Validation

### Backend Validation
1. **File Upload**
   - Check MIME type (PDF, DOCX only)
   - Check file size (max 10MB)
   - Check file exists

2. **Input Validation**
   - Resume text required
   - Job description required
   - Both non-empty

3. **Error Responses**
   ```json
   {
     "error": "Only PDF and DOCX files are allowed",
     "statusCode": 400
   }
   ```

### ML Service Validation
1. Text preprocessing
2. Embedding generation
3. Error handling & fallbacks

---

## Security Considerations

1. **File Upload**
   - MIME type validation
   - File size limits
   - Virus scanning (optional)

2. **API Security**
   - CORS enabled for localhost
   - Rate limiting (optional)
   - Input sanitization

3. **Database**
   - MongoDB connection string in .env
   - No sensitive data in logs

4. **ML Service**
   - No authentication (localhost only for now)
   - Add JWT tokens for production

---

## Performance Optimization

1. **Frontend**
   - React lazy loading
   - CSS optimization
   - Image compression

2. **Backend**
   - Caching (optional)
   - Database indexing
   - Request validation

3. **ML Service**
   - Model caching (loaded once)
   - Batch processing (optional)
   - GPU acceleration (if available)

---

## Testing Strategy

### Unit Tests
```javascript
// Test file upload validation
// Test MongoDB schema
// Test API routes
```

### Integration Tests
```python
# Test ML pipeline
# Test API communication
# Test data flow
```

### E2E Tests
```javascript
// Test complete user flow
// Test error scenarios
// Test dashboard functionality
```

---

## Deployment Architecture

### Production Setup
```
Client (Vercel/Netlify)
   ↓
Backend (Railway/Render)
   ↓
ML Service (Railway/Heroku)
   ↓
MongoDB Atlas
```

### CI/CD Pipeline
```
GitHub Repo
   ↓
GitHub Actions (Testing)
   ↓
Deploy to Production
```

---

## Future Enhancements

1. **User Authentication** - JWT tokens, login system
2. **Resume Storage** - Cloud storage (AWS S3)
3. **Advanced Analytics** - Skill trends, heatmaps
4. **Email Integration** - Send results via email
5. **API Documentation** - Swagger/OpenAPI
6. **Docker Containerization** - Easy deployment
7. **Websocket** - Real-time progress updates
8. **Caching** - Redis for performance

---

**For more details, refer to individual component files and main README.md**
