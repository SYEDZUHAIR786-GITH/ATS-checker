import re
from typing import List
import json

# Skill database
SKILLS_DATABASE = {
    "programming": ["python", "javascript", "java", "c++", "c#", "golang", "rust", "typescript", "php", "swift", "kotlin", "scala"],
    "ml": ["machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn", "nlp", "bert", "gpt", "neural networks", "computer vision"],
    "data": ["data science", "data analysis", "sql", "postgresql", "mongodb", "hadoop", "spark", "pandas", "numpy", "tableau", "powerbi", "data visualization"],
    "web": ["react", "angular", "vue", "django", "flask", "express", "node.js", "html", "css", "web development", "restful", "graphql"],
    "cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "devops", "ci/cd", "terraform", "ansible"],
    "other": ["git", "rest api", "microservices", "agile", "communication", "problem-solving", "leadership", "project management"]
}

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using regex matching"""
    text_lower = text.lower()
    found_skills = set()
    
    for category, skills in SKILLS_DATABASE.items():
        for skill in skills:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
    
    return sorted(list(found_skills))

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two texts using TF-IDF and cosine similarity"""
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        
        vectorizer = TfidfVectorizer(stop_words='english', lowercase=True, max_features=100)
        texts = [text1, text2]
        tfidf_matrix = vectorizer.fit_transform(texts)
        similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
        return float(similarity)
    except:
        # Fallback to keyword matching
        text1_lower = text1.lower()
        text2_lower = text2.lower()
        keywords1 = set(re.findall(r'\b\w{4,}\b', text1_lower))
        keywords2 = set(re.findall(r'\b\w{4,}\b', text2_lower))
        
        if not keywords1 or not keywords2:
            return 0.5
        
        intersection = len(keywords1 & keywords2)
        union = len(keywords1 | keywords2)
        return intersection / union if union > 0 else 0.5

def generate_suggestions(matched: List[str], missing: List[str]) -> List[str]:
    """Generate improvement suggestions"""
    suggestions = []
    
    if not matched:
        suggestions.append("No technical skills found in your resume. Add more skill keywords from the job description.")
    
    if missing:
        missing_str = ", ".join(missing[:5])
        suggestions.append(f"Consider developing or highlighting these skills: {missing_str}")
    
    if len(matched) < 5:
        suggestions.append("Your resume appears to have fewer technical skills than the job description requires.")
    else:
        suggestions.append(f"Great! You have {len(matched)} matching skills. Highlight these prominently in your resume.")
    
    suggestions.append("Ensure your resume uses the same terminology as the job description (ATS systems are keyword-based).")
    
    return suggestions

def extract_keywords(text: str) -> List[str]:
    """Extract important keywords from text"""
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'be', 'was', 'were'}
    
    words = re.findall(r'\b\w{4,}\b', text.lower())
    keywords = [w for w in set(words) if w not in stop_words][:10]
    
    return sorted(keywords)

def handler(event, context):
    """Vercel serverless function handler"""
    try:
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        
        resume_text = body.get('resume_text', '')
        job_description = body.get('job_description', '')
        
        if not resume_text or not job_description:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Resume text and job description are required'})
            }
        
        # Extract skills
        resume_skills = set(extract_skills(resume_text))
        job_skills = set(extract_skills(job_description))
        
        matched_skills = list(resume_skills & job_skills)
        missing_skills = list(job_skills - resume_skills)
        
        # Calculate similarity
        similarity = calculate_similarity(resume_text, job_description)
        match_percentage = int(similarity * 100)
        
        # Generate suggestions
        suggestions = generate_suggestions(matched_skills, missing_skills)
        
        # Extract keywords
        keywords = extract_keywords(resume_text + ' ' + job_description)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'ats_score': match_percentage,
                'match_percentage': match_percentage,
                'matched_skills': matched_skills[:20],
                'missing_skills': missing_skills[:20],
                'suggestions': suggestions,
                'keywords': keywords
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
