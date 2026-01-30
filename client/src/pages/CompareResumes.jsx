import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CompareResumes.css';

const CompareResumes = () => {
  const [resume1, setResume1] = useState(null);
  const [resume2, setResume2] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file, setResume) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setResume({
        name: file.name,
        content: e.target.result.substring(0, 1000) // Preview only
      });
      toast.success('File loaded');
    };
    reader.readAsText(file);
  };

  const handleCompare = async () => {
    if (!resume1 || !resume2 || !jobDesc.trim()) {
      toast.error('Please upload two resumes and enter a job description');
      return;
    }

    setLoading(true);
    try {
      const [analysis1, analysis2] = await Promise.all([
        axios.post('http://localhost:8000/api/analyze', {
          resume_text: resume1.content,
          job_description: jobDesc,
        }),
        axios.post('http://localhost:8000/api/analyze', {
          resume_text: resume2.content,
          job_description: jobDesc,
        }),
      ]);

      setComparison({
        resume1: {
          name: resume1.name,
          score: analysis1.data.ats_score,
          match: analysis1.data.match_percentage,
          skills: analysis1.data.matched_skills,
          missing: analysis1.data.missing_skills,
        },
        resume2: {
          name: resume2.name,
          score: analysis2.data.ats_score,
          match: analysis2.data.match_percentage,
          skills: analysis2.data.matched_skills,
          missing: analysis2.data.missing_skills,
        },
      });

      toast.success('Comparison complete!');
    } catch (err) {
      toast.error('Error comparing resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResume1(null);
    setResume2(null);
    setJobDesc('');
    setComparison(null);
  };

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h1>⚖️ Compare Resumes</h1>
        <p>Compare two resumes against the same job description to see which is more optimized for the position</p>
      </div>

      <div className="compare-setup">
        <div className="resume-input">
          <h3>Resume #1</h3>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => handleFileUpload(e.target.files[0], setResume1)}
          />
          {resume1 && <p className="file-name">✓ {resume1.name}</p>}
        </div>

        <div className="job-input">
          <h3>Job Description</h3>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            rows="8"
          />
        </div>

        <div className="resume-input">
          <h3>Resume #2</h3>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => handleFileUpload(e.target.files[0], setResume2)}
          />
          {resume2 && <p className="file-name">✓ {resume2.name}</p>}
        </div>
      </div>

      <div className="button-group">
        <button
          onClick={handleCompare}
          disabled={loading || !resume1 || !resume2 || !jobDesc}
          className="btn-compare"
        >
          {loading ? '⏳ Comparing...' : '⚖️ Compare Resumes'}
        </button>
        <button onClick={handleReset} className="btn-reset">
          Reset
        </button>
      </div>

      {comparison && (
        <div className="comparison-results">
          <h2>📊 Comparison Results</h2>
          
          <div className="score-comparison">
            <div className={`score-card ${comparison.resume1.score >= comparison.resume2.score ? 'winner' : ''}`}>
              <h3>{comparison.resume1.name}</h3>
              <div className="score-display">
                <div className="score-value">{comparison.resume1.score}%</div>
                <div className="score-label">ATS Score</div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${comparison.resume1.score}%` }}></div>
                </div>
              </div>
              <div className="match-info">
                <p><strong>Match:</strong> {comparison.resume1.match}%</p>
                <p><strong>Matched Skills:</strong> {comparison.resume1.skills.length}</p>
                <p><strong>Missing Skills:</strong> {comparison.resume1.missing.length}</p>
              </div>
            </div>

            <div className="vs-divider">VS</div>

            <div className={`score-card ${comparison.resume2.score >= comparison.resume1.score ? 'winner' : ''}`}>
              <h3>{comparison.resume2.name}</h3>
              <div className="score-display">
                <div className="score-value">{comparison.resume2.score}%</div>
                <div className="score-label">ATS Score</div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${comparison.resume2.score}%` }}></div>
                </div>
              </div>
              <div className="match-info">
                <p><strong>Match:</strong> {comparison.resume2.match}%</p>
                <p><strong>Matched Skills:</strong> {comparison.resume2.skills.length}</p>
                <p><strong>Missing Skills:</strong> {comparison.resume2.missing.length}</p>
              </div>
            </div>
          </div>

          <div className="skills-comparison">
            <div className="skills-col">
              <h3>Skills in {comparison.resume1.name}</h3>
              <div className="skills-list">
                {comparison.resume1.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>

            <div className="skills-col">
              <h3>Skills in {comparison.resume2.name}</h3>
              <div className="skills-list">
                {comparison.resume2.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="recommendation">
            <h3>💡 Recommendation</h3>
            <p>
              {comparison.resume1.score > comparison.resume2.score
                ? `${comparison.resume1.name} is better optimized for this job (${(comparison.resume1.score - comparison.resume2.score).toFixed(1)}% higher score).`
                : comparison.resume2.score > comparison.resume1.score
                ? `${comparison.resume2.name} is better optimized for this job (${(comparison.resume2.score - comparison.resume1.score).toFixed(1)}% higher score).`
                : 'Both resumes have similar optimization levels.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareResumes;
