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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
