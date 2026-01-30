#!/bin/bash

# Start all services
echo "🚀 Starting ATS Resume Checker..."

# Check if MongoDB is running
if ! pgrep -q "mongod"; then
  echo "🗄️  Starting MongoDB..."
  brew services start mongodb/brew/mongodb-community
  sleep 2
fi

# Start ML Service
echo "🤖 Starting ML Service (port 8000)..."
cd ml-service
source venv/bin/activate
python main.py > ../ml-service.log 2>&1 &
ML_PID=$!
cd ..

sleep 3

# Start Backend
echo "⚙️  Starting Backend (port 5001)..."
cd server
npm run dev > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

sleep 3

# Start Frontend
echo "🎨 Starting Frontend (port 3000)..."
cd client
npm start > ../client.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Frontend:  http://localhost:3000"
echo "📍 Backend:   http://localhost:5001"
echo "📍 ML Service: http://localhost:8000"
echo "📍 MongoDB:   mongodb://localhost:27017"
echo ""
echo "📋 Service PIDs:"
echo "   ML Service: $ML_PID"
echo "   Backend: $SERVER_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop all services, run: ./stop-all.sh"
echo ""

# Keep script running
wait
