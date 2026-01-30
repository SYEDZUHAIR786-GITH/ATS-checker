import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history');
      setHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/history/stats/summary');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await axios.delete(`/api/history/${id}`);
        toast.success('Analysis deleted');
        fetchHistory();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete analysis');
      }
    }
  };

  const handleViewResults = (id) => {
    navigate(`/results/${id}`);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4caf50';
    if (score >= 50) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return <div className="loading">📊 Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>📈 Analysis Dashboard</h1>

        {/* Statistics Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalAnalyzed}</div>
              <div className="stat-label">Total Analyses</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.averageAtsScore.toFixed(1)}</div>
              <div className="stat-label">Average ATS Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.averageMatchPercentage.toFixed(1)}%</div>
              <div className="stat-label">Average Match %</div>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="history-section">
          <h2>Recent Analyses</h2>
          {history.length > 0 ? (
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Resume File</th>
                    <th>ATS Score</th>
                    <th>Match %</th>
                    <th>Matched Skills</th>
                    <th>Analyzed Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.fileName}</td>
                      <td>
                        <span
                          className="score-badge"
                          style={{ backgroundColor: getScoreColor(item.atsScore) }}
                        >
                          {item.atsScore}
                        </span>
                      </td>
                      <td>{item.matchPercentage.toFixed(1)}%</td>
                      <td>
                        <div className="skills-preview">
                          {item.matchedSkills.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="skill-badge">
                              {skill}
                            </span>
                          ))}
                          {item.matchedSkills.length > 2 && (
                            <span className="more-badge">+{item.matchedSkills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="actions">
                        <button
                          className="btn-view"
                          onClick={() => handleViewResults(item._id)}
                        >
                          View
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <p>No analyses yet. Start by analyzing a resume!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
