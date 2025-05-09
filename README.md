# BookStore Full-Stack Application

A complete full-stack BookStore application with backend API, web frontend, and mobile app.

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

Or use the npm script:

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
