#!/bin/bash

# ATS Resume Checker - Local Development Setup
# This script starts all services locally without Docker

echo ""
echo "=========================================="
echo "  ATS Resume Checker - Local Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo "${YELLOW}Checking MongoDB...${NC}"
if ! pgrep -q "mongod"; then
  echo "${YELLOW}Starting MongoDB...${NC}"
  brew services start mongodb-community
  sleep 2
fi
echo "${GREEN}✓ MongoDB running on port 27017${NC}"
echo ""

# Setup and start ML Service
echo "${YELLOW}Setting up ML Service...${NC}"
cd ml-service

# Check if virtual environment exists
if [ ! -d "venv" ]; then
  echo "${YELLOW}Creating Python virtual environment...${NC}"
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
echo "${GREEN}✓ Dependencies installed${NC}"

echo "${YELLOW}Starting ML Service (port 8000)...${NC}"
python main.py &
ML_PID=$!
cd ..

sleep 2
echo "${GREEN}✓ ML Service started (PID: $ML_PID)${NC}"
echo ""

# Setup and start Backend
echo "${YELLOW}Setting up Backend...${NC}"
cd server

if [ ! -d "node_modules" ]; then
  echo "${YELLOW}Installing Backend dependencies...${NC}"
  npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "${YELLOW}Creating .env file...${NC}"
  cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ats-checker
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
EOF
fi

echo "${YELLOW}Starting Backend (port 5001)...${NC}"
npm run dev &
SERVER_PID=$!
cd ..

sleep 2
echo "${GREEN}✓ Backend started (PID: $SERVER_PID)${NC}"
echo ""

# Setup and start Frontend
echo "${YELLOW}Setting up Frontend...${NC}"
cd client

if [ ! -d "node_modules" ]; then
  echo "${YELLOW}Installing Frontend dependencies...${NC}"
  npm install
fi

echo "${YELLOW}Starting Frontend (port 3000)...${NC}"
npm start &
CLIENT_PID=$!
cd ..

sleep 3
echo "${GREEN}✓ Frontend started (PID: $CLIENT_PID)${NC}"
echo ""

# Print summary
echo "=========================================="
echo "  ${GREEN}All Services Running!${NC}"
echo "=========================================="
echo ""
echo "  Frontend:  ${GREEN}http://localhost:3000${NC}"
echo "  Backend:   ${GREEN}http://localhost:5001${NC}"
echo "  ML Service: ${GREEN}http://localhost:8000${NC}"
echo "  MongoDB:   ${GREEN}mongodb://localhost:27017${NC}"
echo ""
echo "Process IDs:"
echo "  MongoDB: $(pgrep mongod)"
echo "  ML Service: $ML_PID"
echo "  Backend: $SERVER_PID"
echo "  Frontend: $CLIENT_PID"
echo ""
echo "To stop all services, run: kill $ML_PID $SERVER_PID $CLIENT_PID"
echo "Or: bash STOP_LOCAL.sh"
echo ""
echo "=========================================="
echo ""

# Keep script running
wait
