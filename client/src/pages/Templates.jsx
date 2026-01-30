import React, { useState } from 'react';
import './Templates.css';

function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Modern Tech',
      description: 'Clean, minimal design perfect for tech roles',
      preview: `
JOHN DOE
john@example.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience building scalable applications.
Expertise in full-stack development, cloud architecture, and agile methodologies.

TECHNICAL SKILLS
Languages: JavaScript, Python, Java, SQL
Frameworks: React, Node.js, Django, Spring Boot
Databases: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, AWS, CI/CD Pipelines

PROFESSIONAL EXPERIENCE
Senior Software Engineer | Tech Company (2021-Present)
• Led development of microservices architecture serving 1M+ users
• Improved system performance by 40% through optimization
• Mentored 5+ junior developers on best practices

Software Engineer | StartUp Inc (2019-2021)
• Built REST APIs handling 10K+ requests/second
• Implemented automated testing improving code coverage to 85%
• Collaborated with product team on feature prioritization

EDUCATION
B.S. Computer Science | University Name (2019)
GPA: 3.8/4.0

CERTIFICATIONS
AWS Solutions Architect Associate
Kubernetes for Developers
      `,
      color: '#667eea'
    },
    {
      id: 2,
      name: 'Professional Classic',
      description: 'Traditional format suitable for corporate roles',
      preview: `
JANE SMITH
jane.smith@email.com | (555) 987-6543 | www.janesmith.com

OBJECTIVE
To secure a challenging position in management where expertise in strategic planning
and team leadership can drive organizational success and growth.

CORE COMPETENCIES
• Project Management • Strategic Planning • Team Leadership
• Business Analysis • Process Improvement • Stakeholder Management

PROFESSIONAL EXPERIENCE
Project Manager | Global Corporation (2020-Present)
Managed cross-functional teams of 15+ members on enterprise-scale projects
• Directed $2M+ budget allocation resulting in 20% cost reduction
• Improved project delivery timeline by 25% through lean methodologies
• Maintained 98% client satisfaction rating

Senior Analyst | Business Solutions (2017-2020)
Analyzed business processes and implemented solutions improving efficiency
• Conducted 20+ process improvement initiatives
• Trained 100+ employees on new systems

EDUCATION
MBA - Business Administration | State University (2017)
Bachelor of Commerce | State University (2015)

ACHIEVEMENTS
• "Employee of the Year" Award (2021)
• Published 3 articles on business optimization
      `,
      color: '#764ba2'
    },
    {
      id: 3,
      name: 'Creative Designer',
      description: 'Perfect for creative and design roles',
      preview: `
ALEX MORGAN
alex@designstudio.com | (555) 246-8135 | Portfolio: alexmorgan.design

ABOUT ME
Award-winning UI/UX Designer with 6+ years creating delightful digital experiences
for Fortune 500 companies. Passionate about user-centered design and innovation.

DESIGN EXPERTISE
UI/UX Design • Wireframing • Prototyping • User Research
Design Systems • Figma • Adobe Suite • Web Design

FEATURED PROJECTS
BankFlow Mobile App - Fintech Client
Designed mobile banking app used by 500K+ users
• Increased user engagement by 45%
• Won "Best Financial App Design" award (2023)

EcommercePro Dashboard - SaaS Platform
Created comprehensive admin dashboard for e-commerce platform
• Reduced support tickets by 30%
• Achieved 4.9/5 user satisfaction rating

WORK EXPERIENCE
Lead UX Designer | Creative Agency (2021-Present)
Senior UI Designer | Digital Studio (2018-2021)

EDUCATION
B.A. Graphic Design | Art Institute (2018)
Certification: UX Design Bootcamp (2017)

RECOGNITION
• Design Matters Magazine - Featured Designer (2023)
• 50 Most Influential Designers - Forbes List (2022)
      `,
      color: '#4caf50'
    }
  ];

  const downloadTemplate = (template) => {
    const element = document.createElement('a');
    const file = new Blob([template.preview], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="templates-container">
      <div className="templates-hero">
        <h1>📄 Resume Templates</h1>
        <p>Choose from professionally designed templates optimized for ATS compatibility</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-header" style={{ borderTopColor: template.color }}>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
            
            <div className="template-preview">
              <pre>{template.preview}</pre>
            </div>

            <div className="template-actions">
              <button 
                className="btn-preview"
                onClick={() => setSelectedTemplate(template)}
              >
                👁️ Preview
              </button>
              <button 
                className="btn-download"
                onClick={() => downloadTemplate(template)}
                style={{ backgroundColor: template.color }}
              >
                ⬇️ Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTemplate.name} Template</h2>
              <button className="modal-close" onClick={() => setSelectedTemplate(null)}>✕</button>
            </div>
            <pre className="modal-preview">{selectedTemplate.preview}</pre>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setSelectedTemplate(null)}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  downloadTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                }}
              >
                Download Template
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="templates-tips">
        <h2>✅ ATS-Friendly Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>📝 Simple Formatting</h4>
            <p>Avoid complex layouts, columns, and graphics. Use standard fonts and clear hierarchy.</p>
          </div>
          <div className="tip-card">
            <h4>🎯 Keyword Optimization</h4>
            <p>Include relevant keywords from job description. Use standard section headers.</p>
          </div>
          <div className="tip-card">
            <h4>📋 Consistent Structure</h4>
            <p>Follow standard resume sections: Summary, Skills, Experience, Education.</p>
          </div>
          <div className="tip-card">
            <h4>🚫 Avoid These</h4>
            <p>No images, tables, text boxes, or special characters. Keep it plain and simple.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Templates;
