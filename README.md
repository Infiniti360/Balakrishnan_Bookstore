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

## Mobile App Development

This section provides detailed instructions for setting up and running the mobile application built with React Native and Expo.

## Mobile App Prerequisites

1. **Node.js and npm**

   - Install Node.js (v16 or higher)
   - npm will be installed automatically with Node.js

2. **Expo CLI**

   ```bash
   npm install -g expo-cli
   ```

3. **Expo Go App**

   - Install Expo Go from your device's app store
   - For Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - For iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

4. **Expo Orbit**
   - Install Expo Orbit from [expo.dev](https://expo.dev/orbit)
   - This tool helps manage your Expo development environment

## Mobile App Setup

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure Environment

1. Update the API URL in `src/services/api.ts`:
   ```typescript
   const API_URL = "http://YOUR_LOCAL_IP:8000";
   ```
   Replace `YOUR_LOCAL_IP` with your computer's local IP address.

### 3. Start the Backend Server

1. Activate the Python virtual environment:

   ```bash
   # From the root directory
   source venv/bin/activate  # On macOS/Linux
   # or
   .\venv\Scripts\activate  # On Windows
   ```

2. Start the backend server:
   ```bash
   python app.py
   ```

### 4. Launch the Mobile App

1. **Using Expo Orbit:**

   ```bash
   cd mobile-app
   expo start
   ```

   - Open Expo Orbit
   - Connect your Android device via USB
   - Select your device in Orbit
   - Click "Install with Orbit"

2. **Using Expo Go:**
   - Open Expo Go on your device
   - Scan the QR code shown in the terminal
   - The app will load on your device

### 5. Updating Expo Go

1. **For Android:**

   - Visit [Expo Go on Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Click "Update" if available
   - Or download the latest version from [expo.dev/go](https://expo.dev/go)

2. **For iOS:**
   - Visit [Expo Go on App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Click "Update" if available

## Sample Credentials

Use these credentials to test the app:

- Email: test@example.com
- Password: password123

## Troubleshooting

### Common Issues

1. **Connection Issues**

   - Ensure your mobile device and computer are on the same network
   - Verify the API_URL in `api.ts` matches your computer's local IP
   - Check if the backend server is running

2. **Expo Go Issues**

   - Clear Expo Go app cache
   - Restart Expo Go
   - Ensure you have the latest version installed

3. **Build Issues**

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

## Mobile App Features

- User authentication (login/logout)
- Book listing and management
- Create, read, update, and delete books
- Secure token-based authentication
- Offline support with AsyncStorage
- Error handling and network status checks

## Development Notes

- The app uses React Native with Expo for cross-platform development
- Axios for API communication
- AsyncStorage for local data persistence
- Token-based authentication with JWT
- Error handling for network issues and authentication failures
