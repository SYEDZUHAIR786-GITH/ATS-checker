const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  textContent: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  matchPercentage: {
    type: Number,
    default: 0,
  },
  matchedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  keywords: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);
