'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [inputMode, setInputMode] = useState('text'); // 'file' or 'text'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
        setResumeFile(file);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    const resume = inputMode === 'file' ? resumeText : resumeText;
    
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error('Please provide both resume and job description');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/score', {
        resume_text: resume,
        job_description: jobDescription,
      });

      setResults(response.data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={styles.hero}>
        <h1>🎯 AI-Powered ATS Resume Checker</h1>
        <p>Analyze your resume against job descriptions using advanced ML technology</p>
      </div>

      <div className={styles.content}>
        <form className={styles.formContainer} onSubmit={handleAnalyze}>
          {/* Input Mode Selector */}
          <div className={styles.modeSelector}>
            <button
              type="button"
              className={inputMode === 'text' ? styles.active : ''}
              onClick={() => setInputMode('text')}
            >
              📝 Paste Text
            </button>
            <button
              type="button"
              className={inputMode === 'file' ? styles.active : ''}
              onClick={() => setInputMode('file')}
            >
              📄 Upload File
            </button>
          </div>

          {/* Resume Input */}
          <div className={styles.formSection}>
            <label>Your Resume</label>
            {inputMode === 'file' ? (
              <>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileChange}
                />
                {resumeFile && <p className={styles.fileInfo}>✓ {resumeFile.name}</p>}
              </>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows="10"
              />
            )}
          </div>

          {/* Job Description Input */}
          <div className={styles.formSection}>
            <label>Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="10"
            />
          </div>

          <button type="submit" className={styles.analyzeBtn} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className={styles.resultsContainer}>
            <div className={styles.scoreCard}>
              <h2>📊 ATS Score</h2>
              <div className={styles.score}>{Math.round(results.ats_score || results.matchPercentage)}%</div>
              <p>Match: {results.match_percentage || results.matchPercentage}%</p>
            </div>

            <div className={styles.skillsGrid}>
              <div className={styles.skillsBox}>
                <h3>✅ Matched Skills ({(results.matched_skills || results.matchedSkills || []).length})</h3>
                <div className={styles.skillsList}>
                  {(results.matched_skills || results.matchedSkills || []).map((skill, i) => (
                    <span key={i} className={`${styles.skill} ${styles.matched}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.skillsBox}>
                <h3>❌ Missing Skills ({(results.missing_skills || results.missingSkills || []).length})</h3>
                <div className={styles.skillsList}>
                  {(results.missing_skills || results.missingSkills || []).slice(0, 10).map((skill, i) => (
                    <span key={i} className={`${styles.skill} ${styles.missing}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.suggestionsBox}>
              <h3>💡 Improvement Suggestions</h3>
              <ul>
                {(results.suggestions || []).map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className={styles.keywordsBox}>
              <h3>🏷️ Key Keywords</h3>
              <div className={styles.keywordsList}>
                {(results.keywords || []).map((keyword, i) => (
                  <span key={i} className={styles.keyword}>{keyword}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className={styles.features}>
          <h2>✨ Why Use Our ATS Checker?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <span className={styles.icon}>🤖</span>
              <h3>ML-Powered</h3>
              <p>Advanced analysis for accurate results</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.icon}>📊</span>
              <h3>Detailed Reports</h3>
              <p>Comprehensive skill matching & analysis</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.icon}>⚡</span>
              <h3>Instant Results</h3>
              <p>Get feedback in seconds</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.icon}>🎯</span>
              <h3>Actionable Tips</h3>
              <p>Suggestions to improve your resume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
