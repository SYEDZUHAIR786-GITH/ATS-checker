# Sample Testing Instructions

## How to Test the ATS Checker

### Step 1: Prepare Sample Files
We've provided two sample files for testing:
- `sample_resume.txt` - Example ML Engineer resume
- `sample_job_description.txt` - Example ML Engineer job posting

### Step 2: Convert Resume to PDF (Optional)
For testing PDF upload functionality:
```bash
# Mac/Linux
cat sample_resume.txt | enscript -B -p - | ps2pdf - sample_resume.pdf

# Or use online converter:
# https://word2pdf.com or https://smallpdf.com
```

### Step 3: Test the Application

1. **Open Frontend**
   - Navigate to http://localhost:3000
   - You should see the ATS Checker homepage

2. **Upload Resume**
   - Click "Upload Resume (PDF/DOCX)"
   - Choose sample_resume.txt or sample_resume.pdf
   - Or paste the content directly

3. **Paste Job Description**
   - Copy content from sample_job_description.txt
   - Paste in "Paste Job Description" field

4. **Analyze**
   - Click "Analyze Resume" button
   - Wait for results (5-10 seconds)

### Step 4: Review Results
You should see:
- **ATS Score**: Expected ~80+ (high match)
- **Match Percentage**: Expected ~75-85%
- **Matched Skills**: Python, ML, NLP, etc.
- **Missing Skills**: Kubernetes, GCP, etc.
- **Suggestions**: Improvement tips

### Step 5: Test Dashboard
- Click "Dashboard" in navbar
- View analysis history
- Check statistics (total analyzed, average scores)
- Try deleting an analysis

### Step 6: Test with Different Inputs
Try these scenarios:

**Scenario 1: Perfect Match (Low Score Expected)**
- Use sample_resume.txt with different JD

**Scenario 2: No Match (Very Low Score)**
- Upload resume for accountant role
- Use software engineer JD

**Scenario 3: Text Input**
- Copy resume text directly
- Skip file upload

---

## Expected Test Results

### Sample Data Performance
```
Sample Resume vs Sample JD:
├── ATS Score: 82-88% (High match)
├── Match Percentage: 78-85%
├── Matched Skills: ~12-15
├── Missing Skills: ~3-5
└── Suggestions: 5 personalized tips
```

### Quality Checks
- ✅ File uploads successfully
- ✅ Text extraction works (PDF & DOCX)
- ✅ ML service processes correctly
- ✅ Results display properly
- ✅ Dashboard shows all analyses
- ✅ Error messages are helpful
- ✅ No console errors
- ✅ UI is responsive

---

## Debugging Tips

### Check Logs
```bash
# Backend logs
# Check Terminal 1 (npm run dev)
# Look for: "Request received", "File uploaded", "ML response received"

# ML Service logs
# Check Terminal 2 (python main.py)
# Look for: "POST /api/analyze", processing time

# Frontend logs
# Open DevTools (F12) → Console
# Look for API call responses
```

### Check Connectivity
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test ML service health
curl http://localhost:8000/api/health

# Check MongoDB connection
# Backend logs should show: "MongoDB connected"
```

### Test API Directly
```bash
# Using curl to test API
curl -X POST http://localhost:5000/api/score/score-text \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Python, Machine Learning, NLP",
    "jobDescription": "Need Python, ML, TensorFlow developer"
  }'
```

---

## Performance Notes

### Expected Processing Time
- Text extraction: 1-2 seconds
- BERT embeddings: 2-4 seconds
- Skill extraction: 1 second
- **Total**: 4-7 seconds

### Expected File Sizes
- Sample resume: ~2KB
- Sample JD: ~3KB
- Max upload: 10MB

---

## Troubleshooting Checklist

- [ ] All three services running (Backend, ML, Frontend)
- [ ] MongoDB connected (check backend logs)
- [ ] No port conflicts (5000, 8000, 3000)
- [ ] Sample files in /samples folder
- [ ] Correct file paths in .env
- [ ] Python virtual environment activated
- [ ] Node modules installed (npm install)
- [ ] No errors in console logs

---

## Success Indicators

✅ **Complete Success:**
- Resume uploads and processes
- Results display with ATS score
- Matched/missing skills are relevant
- Suggestions are meaningful
- Dashboard shows analysis history
- No errors in any terminal

---

**Happy Testing! 🎉**

For issues, check SETUP.md Troubleshooting section.
