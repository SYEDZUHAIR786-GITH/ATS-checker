import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ats-checker';

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch(err => {
      console.log('DB connection optional:', err.message);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    console.log('DB error (optional):', err.message);
  }
  
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

let Resume;
try {
  Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
} catch (e) {
  // Model not available
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
    ats_score: Math.min(100, Math.round(matchPercentage)),
    match_percentage: Math.round(matchPercentage),
    matched_skills: matched.slice(0, 15),
    missing_skills: missing.slice(0, 15),
    suggestions: [
      'Add more relevant keywords from the job description',
      'Use the same terminology as the job posting',
      'Highlight your top matching skills prominently',
    ],
    keywords: [...new Set(resumeKeywords)].slice(0, 10),
  };
}

export default async function handler(req, res) {
  // CORS headers
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
    const { resume_text, job_description } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    // Generate analysis
    const analysisResult = generateBasicAnalysis(resume_text, job_description);

    // Try to save to database (optional)
    if (Resume) {
      try {
        await connectDB();
        const newResume = new Resume({
          filename: 'resume.txt',
          content: resume_text,
          jobDescription: job_description,
          ...analysisResult,
        });
        await newResume.save();
      } catch (dbErr) {
        console.log('DB save failed (continuing anyway):', dbErr.message);
      }
    }

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
