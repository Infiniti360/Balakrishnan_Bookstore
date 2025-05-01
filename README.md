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

## Execution & Reporting

### Test Execution Reports

The test suite generates comprehensive reports using Playwright's built-in HTML reporter. Reports include:

- Test execution status (Pass/Fail/Skip)
- Detailed error messages and stack traces
- Test duration and timing information
- Screenshots and videos of failed tests
- Test grouping and organization

### Report Generation

```bash
# Generate HTML report
npx playwright test --reporter=html

# Generate JUnit XML report (for CI integration)
npx playwright test --reporter=junit

# Generate multiple report formats
npx playwright test --reporter=html,junit
```

### Report Location

- HTML reports: `playwright-report/index.html`
- JUnit reports: `test-results/junit-results.xml`

## Testing Strategy

### Test Flow Approach

1. **Health Checks First**

   - Verify environment prerequisites
   - Check server availability
   - Validate database connection
   - Test authentication flow

2. **API Endpoint Testing**

   - CRUD operations for each resource
   - Error handling and edge cases
   - Authentication and authorization
   - Input validation

3. **Test Data Management**
   - Clean test data before each test
   - Use unique identifiers for resources
   - Implement proper cleanup after tests

### Reliability and Maintainability

1. **Test Isolation**

   - Each test is independent
   - No shared state between tests
   - Proper cleanup after each test

2. **Reusable Components**

   - Base API client for common operations
   - Shared test utilities
   - Consistent error handling

3. **Configuration Management**
   - Environment-specific configurations
   - Centralized test data
   - Flexible test parameters

### Challenges and Solutions

1. **Authentication Flow**

   - Challenge: Managing authentication tokens
   - Solution: Implemented token refresh mechanism
   - Result: Reliable authentication across tests

2. **Test Data Cleanup**

   - Challenge: Ensuring clean state for each test
   - Solution: Implemented cleanup hooks
   - Result: Consistent test environment

3. **API Response Validation**
   - Challenge: Complex response structures
   - Solution: Created type-safe response handlers
   - Result: Reliable response validation

## Continuous Integration (CI/CD)

### GitHub Actions Setup

The project includes a GitHub Actions workflow that automatically runs tests on every push and pull request.

### CI Pipeline Steps

1. **Environment Setup**

   ```yaml
   - name: Set up Python
     uses: actions/setup-python@v4
     with:
       python-version: "3.10"

   - name: Set up Node.js
     uses: actions/setup-node@v3
     with:
       node-version: "16"
   ```

2. **Dependencies Installation**

   ```yaml
   - name: Install Python dependencies
     run: |
       python -m pip install --upgrade pip
       pip install -r requirements.txt

   - name: Install Node.js dependencies
     run: |
       npm install
       npx playwright install
   ```

3. **Database Setup**

   ```yaml
   - name: Initialize test database
     run: python init_db.py
   ```

4. **Test Execution**

   ```yaml
   - name: Run tests
     run: npx playwright test --reporter=html,junit
   ```

5. **Report Generation**
   ```yaml
   - name: Upload test results
     uses: actions/upload-artifact@v3
     with:
       name: test-results
       path: |
         playwright-report/
         test-results/
   ```

### CI Configuration File

The complete CI configuration is available in `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      docker:
        image: bookstore
        ports:
          - 8000:8000

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.10"

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          npm install
          npx playwright install

      - name: Initialize database
        run: python init_db.py

      - name: Run tests
        run: npx playwright test --reporter=html,junit

      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            playwright-report/
            test-results/
```

### CI Best Practices

1. **Cache Management**

   - Cache dependencies between runs
   - Clear cache on dependency changes

2. **Parallel Testing**

   - Run tests in parallel when possible
   - Optimize test execution time

3. **Artifact Management**

   - Store test reports as artifacts
   - Keep artifacts for failed runs

4. **Notification**
   - Send notifications on test failures
   - Report test results to pull requests
