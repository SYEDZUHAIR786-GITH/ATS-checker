#!/bin/bash
# 🚀 ATS Resume Checker - One-Click Setup Script (macOS/Linux)

set -e

echo "🚀 ATS Resume Checker Setup Started..."
echo ""

PROJECT_DIR="/Users/zuhairshah/Documents/Ats-checker"
cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  print_error "Node.js not installed. Please install from https://nodejs.org/"
  exit 1
fi
print_status "Node.js $(node --version)"

if ! command -v python3 &> /dev/null; then
  print_error "Python 3 not installed. Please install from https://www.python.org/"
  exit 1
fi
print_status "Python $(python3 --version)"

if ! command -v mongod &> /dev/null; then
  print_warning "MongoDB not found. You'll need MongoDB running."
  print_warning "Use: brew install mongodb-community && mongod"
else
  print_status "MongoDB installed"
fi

echo ""
echo "🔧 Installing dependencies..."
echo ""

# Backend setup
echo "Backend (Node.js)..."
cd "$PROJECT_DIR/server"
npm install > /dev/null 2>&1
if [ ! -f .env ]; then
  cp .env.example .env
  print_status "Created server/.env (update MongoDB URI)"
else
  print_status "server/.env already exists"
fi
print_status "Backend dependencies installed"

# ML Service setup
echo ""
echo "ML Service (Python)..."
cd "$PROJECT_DIR/ml-service"

if [ ! -d "venv" ]; then
  python3 -m venv venv
  print_status "Created Python virtual environment"
fi

source venv/bin/activate
pip install -q -r requirements.txt > /dev/null 2>&1
print_status "ML Service dependencies installed"

# Try to download spaCy model
print_status "Downloading spaCy model (this may take a minute)..."
python -m spacy download en_core_web_sm > /dev/null 2>&1 || \
  print_warning "spaCy model download failed. Run manually: python -m spacy download en_core_web_sm"

# Frontend setup
echo ""
echo "Frontend (React)..."
cd "$PROJECT_DIR/client"
npm install > /dev/null 2>&1
print_status "Frontend dependencies installed"

echo ""
echo "✨ Setup Complete!"
echo ""
echo "📖 Documentation:"
echo "   • SETUP.md - Detailed installation guide"
echo "   • ARCHITECTURE.md - System architecture"
echo "   • samples/TESTING.md - Testing instructions"
echo ""
echo "🚀 To start the application, open 3 terminals and run:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd $PROJECT_DIR/server && npm run dev"
echo ""
echo "   Terminal 2 (ML Service):"
echo "   cd $PROJECT_DIR/ml-service && source venv/bin/activate && python main.py"
echo ""
echo "   Terminal 3 (Frontend):"
echo "   cd $PROJECT_DIR/client && npm start"
echo ""
echo "   Then visit: http://localhost:3000"
echo ""
print_status "Happy analyzing! 🎉"
