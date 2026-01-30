import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('wordprocessingml') || file.type === 'application/msword')) {
      setResumeFile(file);
    } else {
      toast.error('Please upload a PDF or DOCX file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription.trim()) {
      toast.error('Please provide both resume and job description');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const response = await axios.post('/api/score/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resume analyzed successfully!');
      navigate(`/results/${response.data.resumeId}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>AI-Powered ATS Resume Checker</h1>
        <p>Analyze your resume against job descriptions using advanced BERT & NER technology</p>
      </div>

      <div className="container">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="resume">Upload Resume (PDF/DOCX)</label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              required
            />
            {resumeFile && <p className="file-info">✓ {resumeFile.name}</p>}
          </div>

          <div className="form-section">
            <label htmlFor="jobDescription">Paste Job Description</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="8"
              required
            />
          </div>

          <button type="submit" className="btn-analyze" disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </form>

        <div className="features">
          <h2>Why Use Our ATS Checker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>BERT + NER</h3>
              <p>Advanced ML models for accurate analysis</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Detailed Score</h3>
              <p>Get ATS score (0-100) and match percentage</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💡</span>
              <h3>Smart Suggestions</h3>
              <p>AI-generated tips to improve your resume</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Real-time Analysis</h3>
              <p>Get instant results without waiting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
