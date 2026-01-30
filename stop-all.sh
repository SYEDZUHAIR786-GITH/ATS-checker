#!/bin/bash

# Stop all services
echo "🛑 Stopping ATS Resume Checker services..."

# Kill frontend
pkill -f "npm start" || true
echo "✓ Frontend stopped"

# Kill backend
pkill -f "npm run dev" || true
echo "✓ Backend stopped"

# Kill ML service
pkill -f "python main.py" || true
echo "✓ ML Service stopped"

# Kill any remaining Node processes on our ports
lsof -ti:3000,5001,8000 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ All services stopped!"
