# Bookstore API Testing Documentation

This document provides step-by-step instructions to set up and run the Playwright tests for the Bookstore API.

## Prerequisites

1. **Node.js and npm**

   - Install Node.js (v16 or higher)
   - npm will be installed automatically with Node.js
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Python 3.10**

   - Install Python 3.10
   - Verify installation:
     ```bash
     python --version
     ```

3. **Docker**
   - Install Docker Desktop
   - Verify installation:
     ```bash
     docker --version
     ```

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookstore
```

### 2. Set Up Python Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Set Up Node.js Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 4. Database Setup

```bash
# Initialize the test database
python init_db.py
```

### 5. Docker Setup

```bash
# Build the Docker image
cd bookstore
docker build -t bookstore .

# Run the Docker container
docker run -d -p 8000:8000 --name bookstore bookstore
```

## Running Tests

### 1. Verify Server Status

```bash
# Check if Docker container is running
docker ps

# Check if server is responding
curl http://localhost:8000/health
```

### 2. Run Tests

```bash
# Run all tests with HTML reporter
npx playwright test --reporter=html

# Run specific test file
npx playwright test src/tests/health.test.ts

# Run tests in UI mode
npx playwright test --ui
```

### 3. View Test Reports

```bash
# Open the HTML report
npx playwright show-report
```

## Test Structure

### Health Checks (`health.test.ts`)

- Verifies Docker is running
- Checks if localhost server is accessible
- Validates database connection
- Tests user credentials
- Tests all API endpoints

### Book API Tests (`book.api.test.ts`)

- Creates new books
- Retrieves books by ID
- Updates existing books
- Deletes books
- Lists all books
- Handles non-existent books
- Validates book creation with invalid data

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Find process using port 9323
   lsof -i :9323 | grep LISTEN

   # Kill the process
   kill <process-id>
   ```

2. **Docker Issues**

   ```bash
   # Stop and remove existing container
   docker stop bookstore
   docker rm bookstore

   # Rebuild and restart
   docker build -t bookstore .
   docker run -d -p 8000:8000 --name bookstore bookstore
   ```

3. **Database Issues**
   ```bash
   # Reinitialize the database
   python init_db.py
   ```

### Test Debugging

1. **View Test Logs**

   ```bash
   # View Docker logs
   docker logs bookstore
   ```

2. **Run Tests in Debug Mode**
   ```bash
   # Run with debug logs
   DEBUG=pw:api npx playwright test
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /login` - User authentication
- `POST /books/` - Create a new book
- `GET /books/` - List all books
- `GET /books/:id` - Get a specific book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

## Test Credentials

- Email: test@example.com
- Password: password123

## Best Practices

1. Always run tests in a clean environment
2. Verify Docker container status before running tests
3. Check server health before running tests
4. Use the HTML reporter for detailed test results
5. Clean up test data after test runs
