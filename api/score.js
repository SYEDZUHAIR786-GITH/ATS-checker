import mongoose from 'mongoose';
import axios from 'axios';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ats-checker';

// Connect to MongoDB
let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Resume Schema
const resumeSchema = new mongoose.Schema({
  filename: String,
  content: String,
  jobDescription: String,
  atsScore: Number,
  matchPercentage: Number,
  matchedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  keywords: [String],
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { resume_text, job_description } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    // Call Python ML service
    let mlResponse;
    try {
      // Try to call local ML service or use a fallback
      mlResponse = await axios.post('http://localhost:8000/api/analyze', {
        resume_text,
        job_description,
      }, { timeout: 10000 });
    } catch (err) {
      console.log('ML Service unavailable, using basic analysis...');
      // Fallback: Basic analysis
      mlResponse = { data: generateBasicAnalysis(resume_text, job_description) };
    }

    const analysisResult = {
      filename: 'resume.txt',
      content: resume_text,
      jobDescription: job_description,
      atsScore: mlResponse.data.ats_score,
      matchPercentage: mlResponse.data.match_percentage,
      matchedSkills: mlResponse.data.matched_skills,
      missingSkills: mlResponse.data.missing_skills,
      suggestions: mlResponse.data.suggestions,
      keywords: mlResponse.data.keywords,
    };

    // Save to database
    try {
      const newResume = new Resume(analysisResult);
      await newResume.save();
    } catch (dbErr) {
      console.log('Database save skipped:', dbErr.message);
    }

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

function generateBasicAnalysis(resumeText, jobDescription) {
  const jobLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  // Extract keywords
  const jobKeywords = jobLower.match(/\b\w{4,}\b/g) || [];
  const resumeKeywords = resumeLower.match(/\b\w{4,}\b/g) || [];

  const matched = [...new Set(jobKeywords.filter(k => resumeLower.includes(k)))];
  const missing = [...new Set(jobKeywords.filter(k => !resumeLower.includes(k)))];

  const matchPercentage = matched.length > 0 ? (matched.length / jobKeywords.length) * 100 : 0;

  return {
    ats_score: Math.min(100, matchPercentage),
    match_percentage: Math.round(matchPercentage),
    matched_skills: matched.slice(0, 10),
    missing_skills: missing.slice(0, 10),
    suggestions: [
      'Add more relevant keywords from the job description',
      'Use the same terminology as the job posting',
    ],
    keywords: [...new Set(resumeKeywords.slice(0, 10))],
  };
}
