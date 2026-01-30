import React from 'react';
import './Tips.css';

const Tips = () => {
  const tips = [
    {
      category: "ATS Optimization",
      items: [
        "Use simple, clean fonts (Calibri, Arial, Times New Roman)",
        "Avoid images, graphics, and logos in main resume",
        "Use standard section headers: Summary, Experience, Education, Skills",
        "Include a summary or objective statement",
        "Use consistent formatting throughout",
        "Save as PDF or DOCX (avoid images-only formats)"
      ]
    },
    {
      category: "Keywords & Skills",
      items: [
        "Mirror the job description language and keywords",
        "Include technical skills in a dedicated 'Skills' section",
        "Use industry-standard terms and abbreviations",
        "Avoid creative job titles - use standard ones",
        "List tools, frameworks, and languages you're proficient in",
        "Quantify your achievements where possible"
      ]
    },
    {
      category: "Formatting Tips",
      items: [
        "Use single-column layout (avoid multi-column designs)",
        "Keep margins between 0.5-1 inch",
        "Use bullet points instead of paragraphs",
        "Keep font size between 10-12 points",
        "Avoid tables, text boxes, and special formatting",
        "Use consistent date formatting (MM/YYYY)"
      ]
    },
    {
      category: "Content Structure",
      items: [
        "Start with Contact Information",
        "Add a Professional Summary (2-3 lines)",
        "List Experience in reverse chronological order",
        "Include quantifiable results (numbers, percentages)",
        "Add Education, Certifications, and Skills",
        "Keep it to 1-2 pages maximum"
      ]
    },
    {
      category: "Common Mistakes",
      items: [
        "❌ Using non-standard section headers",
        "❌ Embedding images or logos",
        "❌ Using fancy fonts or colors",
        "❌ Exceeding 2 pages",
        "❌ Using inconsistent formatting",
        "❌ Spelling and grammar errors",
        "❌ Including irrelevant information"
      ]
    }
  ];

  return (
    <div className="tips-container">
      <div className="tips-header">
        <h1>📋 ATS Resume Optimization Guide</h1>
        <p>Learn how to format your resume to pass ATS systems and get noticed by recruiters</p>
      </div>

      <div className="tips-grid">
        {tips.map((section, idx) => (
          <div key={idx} className="tip-card">
            <h2>{section.category}</h2>
            <ul>
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="best-practices">
        <h2>✨ Best Practices Checklist</h2>
        <div className="checklist">
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Resume is in PDF or DOCX format</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Uses standard fonts (Calibri, Arial, Times New Roman)</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Clear section headers present</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>No images, tables, or text boxes</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Relevant keywords from job description included</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>1-2 pages maximum</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Contact information at the top</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Consistent date formatting</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>No spelling or grammar errors</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span>Quantifiable achievements included</span>
          </label>
        </div>
      </div>

      <div className="sample-section">
        <h2>📝 Sample Skill Keywords by Industry</h2>
        <div className="keywords-grid">
          <div className="keyword-group">
            <h3>Software Development</h3>
            <p>Python, Java, JavaScript, React, Node.js, SQL, Git, REST API, Agile, CI/CD</p>
          </div>
          <div className="keyword-group">
            <h3>Data Science</h3>
            <p>Machine Learning, Python, R, SQL, TensorFlow, Pandas, Data Analysis, Statistics, Tableau</p>
          </div>
          <div className="keyword-group">
            <h3>Project Management</h3>
            <p>Agile, Scrum, Kanban, Leadership, Budget Management, Risk Assessment, Stakeholder Communication</p>
          </div>
          <div className="keyword-group">
            <h3>Cloud & DevOps</h3>
            <p>AWS, Azure, GCP, Docker, Kubernetes, Jenkins, Terraform, Linux, CI/CD Pipeline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;
