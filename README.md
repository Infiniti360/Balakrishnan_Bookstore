# Bookstore API Testing Framework

This is a comprehensive API testing framework for the Bookstore application, built with Playwright and TypeScript.

## Features

- Complete CRUD operation testing
- Request chaining support
- Comprehensive error handling
- Detailed test reporting
- Environment configuration support
- Type-safe API interactions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   Create a `.env` file in the root directory with the following content:

```
API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

## Running Tests

- Run all tests:

```bash
npm test
```

- Run tests with HTML report:

```bash
npm run test:report
```

- Run tests in debug mode:

```bash
npm run test:debug
```

## Test Structure

- `src/api/`: Contains API client classes

  - `baseApi.ts`: Base API client with common functionality
  - `bookApi.ts`: Book-specific API operations

- `src/tests/`: Contains test files
  - `book.api.test.ts`: Book API test cases

## Test Reports

Test reports are generated in the `test-results` directory after running tests with the HTML reporter.

## Contributing

1. Create a new branch for your feature
2. Write tests for new functionality
3. Ensure all tests pass
4. Submit a pull request
