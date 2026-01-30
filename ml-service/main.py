from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import re
import uvicorn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skill database
SKILLS_DATABASE = {
    "programming": ["python", "javascript", "java", "c++", "c#", "golang", "rust", "typescript", "php", "swift", "kotlin", "scala"],
    "ml": ["machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn", "nlp", "bert", "gpt", "neural networks", "computer vision"],
    "data": ["data science", "data analysis", "sql", "postgresql", "mongodb", "hadoop", "spark", "pandas", "numpy", "tableau", "powerbi", "data visualization"],
    "web": ["react", "angular", "vue", "django", "flask", "express", "node.js", "html", "css", "web development", "restful", "graphql"],
    "cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "devops", "ci/cd", "terraform", "ansible"],
    "other": ["git", "rest api", "microservices", "agile", "communication", "problem-solving", "leadership", "project management"]
}

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

class AnalysisResponse(BaseModel):
    ats_score: float
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]
    keywords: List[str]

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using regex matching"""
    text_lower = text.lower()
    found_skills = set()
    
    for category, skills in SKILLS_DATABASE.items():
        for skill in skills:
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
    
    return sorted(list(found_skills))

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two texts using TF-IDF and cosine similarity"""
    try:
        vectorizer = TfidfVectorizer(stop_words='english', lowercase=True, max_features=100)
        texts = [text1, text2]
        tfidf_matrix = vectorizer.fit_transform(texts)
        similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
        return float(similarity)
    except:
        return 0.5

def generate_suggestions(matched: List[str], missing: List[str]) -> List[str]:
    """Generate improvement suggestions"""
    suggestions = []
    
    if not matched:
        suggestions.append("No technical skills found in your resume. Add more skill keywords from the job description.")
    
    if missing:
        missing_str = ", ".join(missing[:5])  # Top 5 missing skills
        suggestions.append(f"Consider developing or highlighting these skills: {missing_str}")
    
    if len(matched) < 5:
        suggestions.append("Your resume appears to have fewer technical skills than the job description requires.")
    else:
        suggestions.append(f"Great! You have {len(matched)} matching skills. Highlight these prominently in your resume.")
    
    suggestions.append("Ensure your resume uses the same terminology as the job description (ATS systems are keyword-based).")
    
    return suggestions

def extract_keywords(text: str) -> List[str]:
    """Extract important keywords from text"""
    # Remove common words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'be', 'was', 'were'}
    
    # Extract words of 4+ characters
    words = re.findall(r'\b\w{4,}\b', text.lower())
    keywords = [w for w in set(words) if w not in stop_words][:10]
    
    return sorted(keywords)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume(request: AnalysisRequest):
    """Analyze resume against job description"""
    
    resume_text = request.resume_text.strip()
    jd_text = request.job_description.strip()
    
    if not resume_text or not jd_text:
        return AnalysisResponse(
            ats_score=0,
            match_percentage=0,
            matched_skills=[],
            missing_skills=[],
            suggestions=["Both resume and job description are required"],
            keywords=[]
        )
    
    # Extract skills
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(jd_text))
    
    matched_skills = list(resume_skills & jd_skills)
    missing_skills = list(jd_skills - resume_skills)
    
    # Calculate similarity
    similarity = calculate_similarity(resume_text, jd_text)
    
    # Calculate ATS score (0-100)
    skill_match_ratio = len(matched_skills) / max(len(jd_skills), 1) if jd_skills else 0
    text_similarity_score = similarity * 100
    ats_score = (skill_match_ratio * 60) + (min(text_similarity_score, 100) * 0.4)
    
    # Match percentage
    match_percentage = (len(matched_skills) / max(len(jd_skills), 1)) * 100 if jd_skills else 0
    
    # Generate suggestions
    suggestions = generate_suggestions(matched_skills, missing_skills)
    
    # Extract keywords
    keywords = extract_keywords(jd_text)
    
    return AnalysisResponse(
        ats_score=round(min(ats_score, 100), 2),
        match_percentage=round(match_percentage, 2),
        matched_skills=matched_skills,
        missing_skills=missing_skills[:10],  # Top 10 missing skills
        suggestions=suggestions,
        keywords=keywords
    )

@app.get("/health")
async def health_check():
    return {"status": "ML service is running"}

if __name__ == "__main__":
    print("🚀 Starting ML Service on port 8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
