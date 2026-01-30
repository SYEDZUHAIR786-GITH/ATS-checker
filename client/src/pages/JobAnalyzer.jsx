import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './JobAnalyzer.css';

const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setLoading(true);
    try {
      // Call ML service to analyze JD
      const response = await axios.post('http://localhost:8000/api/analyze', {
        resume_text: 'Analyze this job description for required skills and keywords',
        job_description: jobDescription,
      });

      setAnalysis({
        skills: response.data.matched_skills || response.data.missing_skills || [],
        keywords: response.data.keywords || [],
        suggestions: response.data.suggestions || [],
      });

      toast.success('Job description analyzed successfully!');
    } catch (err) {
      toast.error('Error analyzing job description: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setAnalysis(null);
  };

  return (
    <div className="job-analyzer">
      <div className="analyzer-header">
        <h1>🔍 Job Description Analyzer</h1>
        <p>Extract required skills and keywords from any job posting</p>
      </div>

      <div className="analyzer-container">
        <div className="input-section">
          <label>Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows="12"
          />
          <div className="button-group">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Job Description'}
            </button>
            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {analysis && (
          <div className="analysis-results">
            <div className="result-card skills-card">
              <h2>📊 Required Skills ({analysis.skills.length})</h2>
              <div className="skills-list">
                {analysis.skills.length > 0 ? (
                  analysis.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <p>No specific skills identified</p>
                )}
              </div>
            </div>

            <div className="result-card keywords-card">
              <h2>🔑 Key Keywords ({analysis.keywords.length})</h2>
              <div className="keywords-list">
                {analysis.keywords.length > 0 ? (
                  analysis.keywords.map((kw, idx) => (
                    <span key={idx} className="keyword-tag">{kw}</span>
                  ))
                ) : (
                  <p>No keywords extracted</p>
                )}
              </div>
            </div>

            <div className="result-card recommendations-card">
              <h2>💡 Analysis & Recommendations</h2>
              <ul className="recommendations-list">
                {analysis.suggestions && analysis.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="tips-section">
              <h3>📌 Tips for Matching This Job</h3>
              <ul>
                <li>Include all identified skills in your resume</li>
                <li>Use the exact keywords found in the job description</li>
                <li>Highlight projects/experience related to key skills</li>
                <li>Mirror the job description language in your resume</li>
                <li>Quantify your achievements in these skill areas</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {!analysis && !jobDescription && (
        <div className="example-section">
          <h3>Example Job Description Format</h3>
          <div className="example">
            <p>
              <strong>Senior Full Stack Developer</strong><br/>
              <br/>
              We are looking for a Senior Full Stack Developer with expertise in React, Node.js, and MongoDB.
              <br/><br/>
              <strong>Requirements:</strong>
              <ul>
                <li>5+ years of experience in web development</li>
                <li>Proficiency in React, Node.js, and Express</li>
                <li>Strong SQL and NoSQL database skills (MongoDB, PostgreSQL)</li>
                <li>Experience with Docker and Kubernetes</li>
                <li>Knowledge of AWS or GCP</li>
                <li>Git version control expertise</li>
                <li>Excellent communication skills</li>
              </ul>
              ...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;
