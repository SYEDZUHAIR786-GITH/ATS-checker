import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error('Please enter both resume and job description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/score', {
        resume_text: resume,
        job_description: jobDescription,
      });

      setResults(response.data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1>ATS Resume Checker</h1>
      
      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label>Your Resume:</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here..."
            rows="10"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows="10"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={styles.analyzeBtn}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {results && (
        <div className={styles.resultsSection}>
          <div className={styles.scoreCard}>
            <h2>ATS Score</h2>
            <div className={styles.score}>{Math.round(results.atsScore)}%</div>
            <p>Match Percentage: {results.matchPercentage}%</p>
          </div>

          <div className={styles.skillsSection}>
            <div className={styles.skillsGroup}>
              <h3>Matched Skills ({results.matchedSkills.length})</h3>
              <div className={styles.skillsList}>
                {results.matchedSkills.map((skill, i) => (
                  <span key={i} className={`${styles.skill} ${styles.matched}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.skillsGroup}>
              <h3>Missing Skills ({results.missingSkills.length})</h3>
              <div className={styles.skillsList}>
                {results.missingSkills.slice(0, 10).map((skill, i) => (
                  <span key={i} className={`${styles.skill} ${styles.missing}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.suggestionsSection}>
            <h3>Suggestions</h3>
            <ul>
              {results.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
