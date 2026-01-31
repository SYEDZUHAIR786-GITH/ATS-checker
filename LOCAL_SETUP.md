# Local Development Setup (Without Docker/CI-CD)

This guide shows how to run the ATS Resume Checker locally without Docker or CI-CD pipelines.

## Prerequisites

Before starting, ensure you have installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.10+** - [Download](https://www.python.org/)
- **MongoDB** - Install via Homebrew: `brew install mongodb-community`
- **Git** (usually pre-installed on macOS)

## Quick Start (Recommended)

Run everything with one command:

```bash
bash RUN_LOCALLY.sh
```

This will:
1. Start MongoDB (if not already running)
2. Set up Python virtual environment and install dependencies
3. Install Node dependencies for backend and frontend
4. Start ML Service on port 8000
5. Start Backend server on port 5001
6. Start React frontend on port 3000

Wait for the output to show "All Services Running!" then visit: **http://localhost:3000**

## Manual Setup (If Preferred)

### Terminal 1: Start MongoDB

```bash
brew services start mongodb-community
```

### Terminal 2: Start ML Service

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Terminal 3: Start Backend

```bash
cd server
npm install  # Only needed first time
npm run dev
```

### Terminal 4: Start Frontend

```bash
cd client
npm install  # Only needed first time
npm start
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **ML Service**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017

## Environment Configuration

The backend automatically creates a `.env` file with default values. If you need to modify settings:

```bash
cd server
# Edit .env file
nano .env
```

Default `.env`:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ats-checker
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

## Troubleshooting

### MongoDB won't start
```bash
# Check if MongoDB is installed
brew list mongodb-community

# Install if missing
brew tap mongodb/brew
brew install mongodb-community

# Start service
brew services start mongodb-community

# Check status
brew services list
```

### Python virtual environment issues
```bash
cd ml-service
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node modules issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
Change ports in:
- **Backend**: Edit `server/.env` (PORT=5001)
- **Frontend**: Edit `client/package.json` (PORT=3000)
- **ML Service**: Edit `ml-service/main.py` (port 8000)

## Stopping Services

To stop all services:

```bash
bash STOP_LOCAL.sh
```

Or manually in each terminal: `Ctrl+C`

## Development Tips

1. **Hot Reload**: Frontend and Backend have hot reload enabled - just save your files
2. **Database**: MongoDB data persists between sessions in `/opt/homebrew/var/mongodb`
3. **Logs**: Check terminal output for real-time logs
4. **Testing**: All services must be running for full functionality

## Database Management

### View MongoDB databases
```bash
mongosh
> show dbs
> use ats-checker
> show collections
```

### Reset database
```bash
mongosh
> use ats-checker
> db.dropDatabase()
```

---

**CI-CD has been removed.** This local setup is optimized for development without Docker overhead.
