const nodemailer = require('nodemailer');
const Resume = require('../models/Resume');

// Configure email service (using Gmail SMTP - update credentials in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send analysis results via email
const sendAnalysisEmail = async (req, res) => {
  try {
    const { id, userEmail } = req.body;

    if (!id || !userEmail) {
      return res.status(400).json({ message: 'ID and email are required' });
    }

    // Fetch the analysis results
    const result = await Resume.findById(id);
    if (!result) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Create email HTML content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 12px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .score-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .score-card { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
          .score-value { font-size: 24px; font-weight: bold; color: #333; }
          .score-label { color: #666; font-size: 12px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
          .skill-tag { display: inline-block; background: #e8eaf6; color: #667eea; padding: 6px 12px; border-radius: 20px; margin: 4px; font-size: 12px; }
          .suggestion-item { background: #f0f4ff; padding: 12px; margin: 8px 0; border-left: 4px solid #667eea; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Your ATS Analysis Report</h1>
            <p>Resume Analysis for: <strong>${result.jobTitle || 'Position'}</strong></p>
          </div>

          <div class="score-grid">
            <div class="score-card">
              <div class="score-label">ATS Score</div>
              <div class="score-value">${result.atsScore || 0}</div>
              <div class="score-label">Out of 100</div>
            </div>
            <div class="score-card">
              <div class="score-label">Match Rate</div>
              <div class="score-value">${result.matchRate || 0}%</div>
              <div class="score-label">Skills Matched</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📊 Matched Skills</div>
            ${result.matchedSkills?.map(skill => `<span class="skill-tag">✓ ${skill}</span>`).join('') || '<p>No matched skills</p>'}
          </div>

          <div class="section">
            <div class="section-title">⚠️ Missing Skills</div>
            ${result.missingSkills?.map(skill => `<span class="skill-tag">${skill}</span>`).join('') || '<p>No missing skills</p>'}
          </div>

          <div class="section">
            <div class="section-title">💡 Suggestions</div>
            ${result.suggestions?.map(sugg => `<div class="suggestion-item">${sugg}</div>`).join('') || '<p>No suggestions</p>'}
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} from ATS Resume Checker</p>
            <p>Visit: http://localhost:3000 for more details</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `📊 Your ATS Analysis Report - ${result.atsScore}/100`,
      html: emailHTML,
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

module.exports = { sendAnalysisEmail };
