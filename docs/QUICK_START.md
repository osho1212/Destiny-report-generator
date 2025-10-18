# 🚀 Quick Start Guide

This guide will help you get the Destiny Report Generator up and running in minutes.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Accessing on Mobile](#accessing-on-mobile)
- [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- **Python** (3.8 or higher)
  - Check: `python --version` or `python3 --version`
  - Download: https://python.org/

- **pip** (Python package manager)
  - Usually comes with Python
  - Check: `pip --version` or `pip3 --version`

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd "Destiny Report Generator"
```

### Step 2: Set Up Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Set Up Frontend

Open a **new terminal** window and:

```bash
# Navigate to frontend folder
cd "Destiny Report Generator/frontend"

# Install dependencies
npm install
```

---

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
source venv/bin/activate  # Activate venv if not already active
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5001
```

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm start
```

The browser should automatically open to:
```
http://localhost:3000
```

---

## Accessing on Mobile

To access the application on your mobile device:

1. **Ensure both devices are on the same WiFi network**

2. **Find your computer's local IP address:**

   **On macOS/Linux:**
   ```bash
   ipconfig getifaddr en0
   # or
   ipconfig getifaddr en1
   ```

   **On Windows:**
   ```bash
   ipconfig
   # Look for IPv4 Address under your active network adapter
   ```

3. **Access from mobile:**
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

   For example:
   ```
   http://192.168.31.121:3000
   ```

---

## Common Issues

### Port Already in Use

**Backend (Port 5001):**
Edit `backend/app.py` and change the port:
```python
app.run(debug=True, port=5002, host='127.0.0.1')
```

**Frontend (Port 3000):**
```bash
PORT=3001 npm start
```

### Virtual Environment Not Activating

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

If still having issues:
```bash
# Delete and recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Module Not Found Errors

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Ensure `flask-cors` is installed:
```bash
cd backend
source venv/bin/activate
pip install flask-cors
```

### Cannot Access on Mobile

1. Check firewall settings - allow incoming connections on port 3000
2. Ensure both devices are on the same network
3. Try accessing with computer's IP instead of localhost

---

## Next Steps

- Read the [Project Structure](PROJECT_STRUCTURE.md) to understand the codebase
- Check out the [Deployment Guide](DEPLOYMENT.md) for production deployment
- Return to [Main README](../README.md) for more information

---

## Need Help?

If you encounter any issues not covered here, please:
1. Check the [Troubleshooting](../README.md#-troubleshooting) section in the main README
2. Open an issue on GitHub
3. Review the error messages carefully - they often contain helpful information

Happy reporting! 🎉
