# BookStore Full-Stack Application

A complete full-stack BookStore application with backend API, web frontend, and mobile app.

A. Check your installed Java versions

/usr/libexec/java_home -V

B. Switch to Java 17
If you have Java 17 installed, set it as your active Java version:

export JAVA_HOME=$(/usr/libexec/java_home -v 17)

C. Verify

java -version

D. Clean and Rebuild

cd android
./gradlew clean
cd ..
npx expo run:android

REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start --dev-client --clear

Should show something like:

openjdk version "17.0.x" ...

## Project Structure

- **backend/** - FastAPI backend with SQLite database
- **web/** - React.js web application
- **mobile/** - React Native mobile application (Expo)
- **tests/** - WebDriver tests for end-to-end testing

## Features

- User authentication (login/register)
- CRUD operations for books (Create, Read, Update, Delete)
- Responsive web interface
- Mobile app for iOS and Android
- End-to-end tests with WebDriver

## Requirements

- Python 3.8+
- Node.js 16+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Chrome browser (for WebDriver tests)

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd bookstore
```

### 2. Backend Setup

```bash
# Create a virtual environment
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=sqlite:///./bookstore.db" > .env
echo "PORT=5000" >> .env
echo "SECRET_KEY=your_secret_key_for_jwt" >> .env
```

### 3. Web App Setup

```bash
cd web
npm install
```

### 4. Mobile App Setup

```bash
cd mobile
npm install
```

### 5. WebDriver Test Setup

```bash
# Install WebDriver dependencies
npm install -g webdriverio
npm install -g chromedriver

# Make sure Chrome browser is installed
```

## Running the Applications

### Kill Ports (if already in use)

```bash
npm run kill-ports
```

### Start Backend

```bash
cd backend
# Activate virtual environment if not already activated
source venv/bin/activate  # On Windows: venv\Scripts\activate
python run.py
```

lsof -ti :5001 | xargs kill -9

pip3 install -r requirements.txt
python3 run.py

npx expo start --dev-client

A. Clean the Android Build

cd android
./gradlew clean
cd ..

Then try again:

npx expo run:android

B. Reinstall Node Modules and Clear Caches

rm -rf node_modules
rm -rf android/build
rm -rf android/app/build
npm install
npx expo start -c

1. Build a development client
   From your project root (or mobile directory), run:
   npx expo run:android

2. After the build completes
   You can then run:

npx expo start --dev-client

```bash
npm run start:backend
```

### Start Web App

```bash
cd web
npm start
```

Or use the npm script:

```bash
npm run start:web
```

### Start Mobile App

```bash
cd mobile
npm start
```

Or use the npm script:

```bash
npm run start:mobile
```

### Start All Applications

```bash
npm run start:all
```

## API Endpoints

The backend API will be available at `http://localhost:5000/api`.

### Authentication

- **POST /api/register** - Register a new user
- **POST /api/login** - Login with email and password
- **POST /api/logout** - Logout (clears token)

### Books

- **GET /api/books** - Get all books
- **GET /api/books/:id** - Get a single book by ID
- **POST /api/books** - Create a new book
- **PUT /api/books/:id** - Update a book
- **DELETE /api/books/:id** - Delete a book

## Running Tests

### WebDriver Tests

Make sure that the web app is running before running the tests.

```bash
npm run test:webdriver
```

## Default Login Credentials

The application is seeded with the following default users:

- **Admin User**:

  - Email: admin@bookstore.com
  - Password: admin123

- **Regular User**:
  - Email: user@bookstore.com
  - Password: user123

## Android Emulator Setup and Troubleshooting

If you encounter issues with the Android emulator not connecting to the Metro bundler, follow these steps:

### 1. Clean Metro Bundler Start

```bash
cd mobile
npx expo start --clear
```

This clears the Metro bundler cache and starts with a fresh instance.

### 2. Port Forwarding Setup

```bash
adb reverse tcp:8082 tcp:8082
```

This sets up port forwarding between your computer and the Android emulator.

### 3. Development Client Update

```bash
cd mobile
npx expo install expo-dev-client
```

This ensures you have the latest compatible version of the development client.

### 4. Start with Explicit Host Configuration

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start --dev-client --clear
```

This forces Metro to use localhost instead of network IP.

### Running the App

1. Make sure the Android emulator is running
2. Press 'a' in the Metro terminal to launch on Android
3. Wait for the app to load in the emulator

If you still encounter issues:

- Check that no other Metro instances are running
- Ensure the emulator has internet connectivity
- Try restarting the emulator
- Clear the Metro cache again with `npx expo start --clear`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting Guide & Recent Fixes

### Date: April 24, 2024 (Updates from 7 PM onwards)

### 1. Backend Dependencies Resolution

```bash
# Fix Pydantic and SQLModel compatibility
pip uninstall pydantic
pip install pydantic==1.10.13

# Update requirements.txt with fixed versions
echo "pydantic==1.10.13" >> requirements.txt
echo "sqlmodel==0.0.8" >> requirements.txt
```

### 2. Database Connection Setup

```bash
# Ensure correct database URL in .env
echo "DATABASE_URL=sqlite:///./bookstore.db" > .env

# Initialize database with proper schema
python init_db.py

# Verify database creation
ls -l bookstore.db
```

### 3. Port Forwarding for Android Development

```bash
# Set up port forwarding for development
adb reverse tcp:5001 tcp:5001
adb reverse tcp:8081 tcp:8081
adb reverse tcp:19000 tcp:19000

# Verify port forwarding
adb reverse --list
```

### 4. Metro Bundler Cache Clear

```bash
# Clear metro bundler cache
cd mobile
npx expo start --clear

# If issues persist, try with explicit host
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start --dev-client --clear
```

### 5. Backend API Configuration

```bash
# Update API base URL in mobile app configuration
# In mobile/src/config/api.js:
API_BASE_URL = 'http://10.0.2.2:5001/api'  # For Android Emulator
# or
API_BASE_URL = 'http://localhost:5001/api'  # For iOS Simulator
```

### Key Issues Fixed:

1. **Database Model Errors**

   - Issue: "'BookCreate' object has no attribute 'model_dump'"
   - Fix: Downgraded Pydantic to version 1.10.13
   - Impact: Resolved model serialization errors

2. **Authentication Flow**

   - Issue: Token validation failures
   - Fix: Implemented proper OAuth2 flow with JWT
   - Impact: Secure user authentication working

3. **Data Seeding**

   - Issue: Empty database on fresh start
   - Fix: Added automatic data seeding with default books and users
   - Impact: Application starts with pre-populated data

4. **Network Connectivity**

   - Issue: "Network request failed" errors
   - Fix: Proper port forwarding and API URL configuration
   - Impact: Stable connection between mobile app and backend

5. **Model Validation**
   - Issue: Inconsistent data validation
   - Fix: Added proper validation schemas with Pydantic
   - Impact: Robust data validation for all API endpoints

### Verification Steps:

1. **Backend Health Check**

```bash
# Start the backend server
cd backend
source venv/bin/activate
python run.py

# Test API endpoint
curl http://localhost:5001/api/health
```

2. **Database Verification**

```bash
# Check seeded data
sqlite3 bookstore.db
> SELECT * FROM books;
> SELECT * FROM user_credentials;
```

3. **Mobile App Connection**

```bash
# Clear existing processes
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Start fresh
cd mobile
npx expo start --clear
```

### Current Working State:

- Backend running on port 5001
- Database seeded with default data
- Mobile app connecting successfully
- Authentication working for both admin and regular users
- Book CRUD operations functioning properly

### Default Credentials (for testing):

```
Admin User:
- Email: admin@bookstore.com
- Password: admin123

Regular User:
- Email: user@bookstore.com
- Password: user123
```

### Known Working Configurations:

- Python: 3.8+
- Pydantic: 1.10.13
- SQLModel: 0.0.8
- Node.js: 16+
- Expo SDK: latest
- React Native: latest

These fixes have resolved the major blocking issues and established a stable development environment. The application is now functioning as intended with proper data flow between all components.

Here’s a clean, professional project documentation for setting up and running your Bookstore App (Backend + Frontend) across Mobile (Android/iOS) and Web, complete with database verification, API testing, and port forwarding for emulators.

⸻

📚 Bookstore App – Developer Setup Documentation

This guide explains how to set up, run, and test the Bookstore application’s backend and frontend components across Android, iOS, and Web using Expo and FastAPI.

⸻

🔧 Prerequisites

Ensure you have the following installed:
• Python 3.10+
• Node.js 16+
• Java 17 (Zulu/OpenJDK)
• Expo CLI: npm install -g expo-cli
• adb (for Android emulator support)
• SQLite (for querying the DB)
• Git, pip, and virtualenv

⸻

📦 Backend Setup (FastAPI)

1. Create and Activate Virtual Environment

python3 -m venv venv
source venv/bin/activate # macOS/Linux

2. Install Python Dependencies

pip install --upgrade pip
pip install -r requirements.txt

3. Confirm Java 17 is Configured

export JAVA_HOME=$(/usr/libexec/java_home -v 17)
java -version

Expected output:

openjdk version "17.0.15" ...

4. Start the Backend Server

uvicorn main:app --host 0.0.0.0 --port 5001

This allows access from mobile devices/emulators on the same network.

⸻

🧪 Backend API Verification

1. Root API Check

curl http://localhost:5001/

# {"status":"ok","message":"Welcome to Bookstore API"}

2. Health Endpoint

curl http://localhost:5001/api/health

# {"status":"healthy","service":"bookstore-api"}

⸻

📱 Frontend (Mobile App via Expo)

1. Navigate to Mobile Directory

cd bookstore/mobile

2. Clean Android Gradle Cache (Optional for Native Builds)

cd android
./gradlew clean
cd ..

3. Start Expo Dev Server (with Dev Client)

REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start --dev-client --clear

This supports Android/iOS native modules in development.

⸻

🌐 Frontend Web Access

To run the project in a web browser:

npx expo start --web

Ensure backend is accessible from browser (via localhost:5001 or your local IP).

⸻

🤖 Android Emulator Port Forwarding

Forward port 5001 so the Android emulator can reach the backend server:

adb reverse tcp:5001 tcp:5001
adb reverse --list # confirm it's registered

Then test from emulator using:

curl http://10.0.2.2:5001/api/books

⸻

🗃️ SQLite Database Check

1. Confirm DB File Exists

ls -la bookstore.db

2. Inspect DB Contents

sqlite3 bookstore.db "SELECT \* FROM books;"

⸻

🛠 Restart Server with Health Endpoint Changes

If you modified the FastAPI app:

pkill -f "uvicorn main:app"
uvicorn main:app --host 0.0.0.0 --port 5001

⸻

✅ Summary: Common Commands

Task Command
Start Backend uvicorn main:app --host 0.0.0.0 --port 5001
Start Expo Dev Server npx expo start --dev-client --clear
Start for Web npx expo start --web
Port Forward for Emulator adb reverse tcp:5001 tcp:5001
Test API curl http://localhost:5001/api/books
Check SQLite DB sqlite3 bookstore.db "SELECT \* FROM books;"
Kill Server (Optional Cleanup) pkill -f "uvicorn main:app"

⸻

📁 Recommended Repo Structure

bookstore/
├── backend/
│ ├── main.py
│ ├── run.py
│ ├── requirements.txt
│ └── bookstore.db
├── mobile/
│ ├── App.js
│ ├── app/ (expo-router screens)
│ └── android/

⸻

Let me know if you’d like a README.md file generated from this automatically.

test@example..com / password123
