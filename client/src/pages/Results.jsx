import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Results.css';

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/score/${id}`);
        setResult(response.data.data);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to fetch results');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, navigate]);

  const exportToPDF = async () => {
    const element = document.getElementById('results-content');
    const canvas = await html2canvas(element);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 270);
    pdf.save(`ATS-Analysis-${id}.pdf`);
    toast.success('PDF downloaded!');
  };

  if (loading) {
    return <div className="loading">📊 Analyzing your resume...</div>;
  }

  if (!result) {
    return <div className="error">No results found</div>;
  }

  const scoreColor = result.atsScore >= 70 ? '#4caf50' : result.atsScore >= 50 ? '#ff9800' : '#f44336';
  const matchedCount = result.matchedSkills ? result.matchedSkills.length : 0;
  const missingCount = result.missingSkills ? result.missingSkills.length : 0;
  const totalSkills = matchedCount + missingCount;

  return (
    <div className="results-container">
      <div id="results-content" className="results">
        <div className="container">
          {/* Header */}
          <div className="results-header">
            <div className="header-content">
              <div className="header-badge">
                <span className="badge-icon">✓</span>
              </div>
              <div className="header-text">
                <h1>ATS Analysis</h1>
                <p className="position-title">Your resume was analyzed for your position: <strong>Machine Learning Engineer</strong></p>
                <button className="view-jd" onClick={() => alert(result.jobDescription || 'Job Description')}>View Job Description</button>
              </div>
            </div>
            <button className="btn-new-analysis" onClick={() => navigate('/')}>New Analysis</button>
          </div>

          {/* Score Grid */}
          <div className="score-grid">
            {/* ATS Score Card */}
            <div className="score-card">
              <h3>ATS Score</h3>
              <div className="circular-score">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="score-bg" />
                  <circle cx="50" cy="50" r="45" className="score-circle" style={{ 
                    strokeDasharray: `${(result.atsScore / 100) * 282.7} 282.7`,
                    stroke: scoreColor
                  }} />
                </svg>
                <div className="score-text">
                  <span className="score-number">{Math.round(result.atsScore)}</span>
                  <span className="score-max">Out of 100</span>
                </div>
              </div>
            </div>

            {/* Match Rate Card */}
            <div className="stat-card">
              <h3>Match Rate</h3>
              <div className="stat-value" style={{ color: scoreColor }}>{Math.round(result.matchPercentage)}%</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${result.matchPercentage}%`, backgroundColor: scoreColor }}></div>
              </div>
              <div className="stat-labels">
                <span>Matching Skills</span>
                <span>{Math.round(result.matchPercentage)}%</span>
              </div>
            </div>

            {/* Missing Keywords Card */}
            <div className="stat-card">
              <h3>Missing Keywords</h3>
              <div className="stat-value missing">{missingCount}</div>
              <div className="stat-bar">
                <div className="stat-fill missing" style={{ width: `${(missingCount / totalSkills) * 100}%` }}></div>
              </div>
              <div className="stat-labels">
                <span>Missing Skills</span>
                <span>{Math.round((missingCount / totalSkills) * 100)}%</span>
              </div>
            </div>

            {/* Suggestions Card */}
            <div className="suggestions-card">
              <h3>Resume Suggestions</h3>
              <div className="suggestions-list">
                {result.suggestions && result.suggestions.slice(0, 2).map((suggestion, idx) => (
                  <div key={idx} className="suggestion-item">
                    <span className="suggestion-icon">✓</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="skills-section">
            <div className="skills-col">
              <div className="skill-box matching">
                <h3>Skills Match</h3>
                <div className="skill-stats">
                  <div className="stat-row">
                    <span className="stat-label">✓ Matching Keywords</span>
                    <div className="stat-progress">
                      <div className="progress-bar-thin">
                        <div className="progress-fill-green" style={{ width: `${(matchedCount / totalSkills) * 100}%` }}></div>
                      </div>
                      <span className="stat-number">{matchedCount} / {totalSkills}</span>
                    </div>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">✗ Missing Skills</span>
                    <div className="stat-progress">
                      <div className="progress-bar-thin">
                        <div className="progress-fill-red" style={{ width: `${(missingCount / totalSkills) * 100}%` }}></div>
                      </div>
                      <span className="stat-number">{missingCount} / {totalSkills}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="skills-col">
              <div className="skill-box recommendations">
                <h3>Resume Suggestions</h3>
                <div className="suggestions-full">
                  {result.suggestions && result.suggestions.slice(0, 3).map((suggestion, idx) => (
                    <div key={idx} className="suggestion-full-item">
                      <span className="suggestion-badge">{['REST API', 'Machine Learning', 'Data Preprocessing'][idx] || '•'}</span>
                      <span className="suggestion-text">{suggestion.substring(0, 60)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="keywords-section">
            <h3>Keyword Recommendations</h3>
            <div className="keywords-badges">
              <span className="keyword-badge">MarA Match</span>
              {result.keywords && result.keywords.slice(0, 4).map((kw, idx) => (
                <span key={idx} className="keyword-badge">{kw}</span>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="action-section">
            <button className="btn-download" onClick={exportToPDF}>
              📥 Download improved Resume
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="btn-back-float" onClick={() => navigate('/')}>← Back</button>
    </div>
  );
}

export default Results;
