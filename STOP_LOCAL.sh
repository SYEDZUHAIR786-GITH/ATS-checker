#!/bin/bash

# ATS Resume Checker - Stop All Local Services

echo ""
echo "Stopping all services..."
echo ""

# Kill all node processes related to the project
pkill -f "npm start" 2>/dev/null && echo "✓ Frontend stopped"
pkill -f "npm run dev" 2>/dev/null && echo "✓ Backend stopped"
pkill -f "python main.py" 2>/dev/null && echo "✓ ML Service stopped"

echo ""
echo "All services stopped!"
echo ""
