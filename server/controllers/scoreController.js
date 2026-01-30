const Resume = require('../models/Resume');
const axios = require('axios');
const pdf = require('pdf-parse');
const fs = require('fs');
const mammoth = require('mammoth');

// Get ML service URL from environment
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Helper: Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    throw new Error('PDF parsing failed: ' + err.message);
  }
};

// Helper: Extract text from DOCX
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (err) {
    throw new Error('DOCX parsing failed: ' + err.message);
  }
};

// Helper: Extract text based on file type
const extractTextFromFile = async (filePath, mimeType) => {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
    return await extractTextFromDOCX(filePath);
  } else {
    throw new Error('Unsupported file type');
  }
};

// Controller: Analyze Resume
exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ error: 'Resume file and job description are required' });
    }

    // Extract resume text
    const resumeText = await extractTextFromFile(req.file.path, req.file.mimetype);
    const jobDescription = req.body.jobDescription;

    // Call ML service (Python FastAPI)
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/analyze`, {
      resume_text: resumeText,
      job_description: jobDescription,
    }, { timeout: 30000 });

    // Save to MongoDB
    const resume = new Resume({
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      textContent: resumeText,
      jobDescription,
      atsScore: mlResponse.data.ats_score,
      matchPercentage: mlResponse.data.match_percentage,
      matchedSkills: mlResponse.data.matched_skills,
      missingSkills: mlResponse.data.missing_skills,
      suggestions: mlResponse.data.suggestions,
      keywords: mlResponse.data.keywords,
    });

    await resume.save();

    res.status(201).json({
      success: true,
      resumeId: resume._id,
      data: {
        atsScore: resume.atsScore,
        matchPercentage: resume.matchPercentage,
        matchedSkills: resume.matchedSkills,
        missingSkills: resume.missingSkills,
        suggestions: resume.suggestions,
      },
    });
  } catch (err) {
    console.error('Error analyzing resume:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Controller: Score with raw text
exports.scoreText = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/analyze`, {
      resume_text: resumeText,
      job_description: jobDescription,
    }, { timeout: 30000 });

    // Save to MongoDB
    const resume = new Resume({
      fileName: 'text-input-' + Date.now(),
      fileUrl: '',
      textContent: resumeText,
      jobDescription,
      atsScore: mlResponse.data.ats_score,
      matchPercentage: mlResponse.data.match_percentage,
      matchedSkills: mlResponse.data.matched_skills,
      missingSkills: mlResponse.data.missing_skills,
      suggestions: mlResponse.data.suggestions,
      keywords: mlResponse.data.keywords,
    });

    await resume.save();

    res.status(201).json({
      success: true,
      resumeId: resume._id,
      data: {
        atsScore: resume.atsScore,
        matchPercentage: resume.matchPercentage,
        matchedSkills: resume.matchedSkills,
        missingSkills: resume.missingSkills,
        suggestions: resume.suggestions,
      },
    });
  } catch (err) {
    console.error('Error scoring text:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Controller: Get score details
exports.getScoreDetails = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
