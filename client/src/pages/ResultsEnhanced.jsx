import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Results.css';

const ResultsEnhanced = ({ resumeId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/score/${resumeId}`);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [resumeId]);

  const exportToPDF = async () => {
    const element = document.getElementById('results-report');
    const canvas = await html2canvas(element);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 270);
    pdf.save(`ATS-Analysis-${resumeId}.pdf`);
  };

  if (loading) return <div className="loading">Loading results...</div>;
  if (!data) return <div>No data found</div>;

  const skillsData = [
    { name: 'Matched Skills', value: data.matchedSkills.length, fill: '#4CAF50' },
    { name: 'Missing Skills', value: data.missingSkills.length, fill: '#FF6B6B' },
  ];

  const scoreData = [
    { category: 'ATS Score', value: data.atsScore },
    { category: 'Match %', value: data.matchPercentage },
  ];

  return (
    <div id="results-report" className="results-enhanced">
      <div className="results-header">
        <h1>ATS Analysis Report</h1>
        <button onClick={exportToPDF} className="export-btn">📥 Download PDF</button>
      </div>

      <div className="score-section">
        <div className="score-card primary">
          <div className="score-value">{data.atsScore}%</div>
          <div className="score-label">ATS Score</div>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${data.atsScore}%` }}></div>
          </div>
        </div>

        <div className="score-card secondary">
          <div className="score-value">{data.matchPercentage}%</div>
          <div className="score-label">Match Percentage</div>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${data.matchPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Skills Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {skillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Score Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#6C63FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="skills-section">
        <div className="skills-group matched">
          <h3>✅ Matched Skills ({data.matchedSkills.length})</h3>
          <div className="skills-list">
            {data.matchedSkills.length > 0 ? (
              data.matchedSkills.map((skill, idx) => (
                <span key={idx} className="skill-badge matched">
                  {skill}
                </span>
              ))
            ) : (
              <p>No matched skills</p>
            )}
          </div>
        </div>

        <div className="skills-group missing">
          <h3>❌ Missing Skills ({data.missingSkills.length})</h3>
          <div className="skills-list">
            {data.missingSkills.length > 0 ? (
              data.missingSkills.map((skill, idx) => (
                <span key={idx} className="skill-badge missing">
                  {skill}
                </span>
              ))
            ) : (
              <p>All skills matched!</p>
            )}
          </div>
        </div>
      </div>

      <div className="suggestions-section">
        <h3>💡 Recommendations</h3>
        <ul className="suggestions-list">
          {data.suggestions && data.suggestions.map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="keywords-section">
        <h3>🔑 Important Keywords</h3>
        <div className="keywords-list">
          {data.keywords && data.keywords.map((keyword, idx) => (
            <span key={idx} className="keyword">{keyword}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsEnhanced;
