# Bookstore Project

A modern bookstore application with a FastAPI backend, PostgreSQL database, and React TypeScript frontend.

## Project Structure

````
bookstore/
├── backend/              # FastAPI backend server
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   ├── core/        # Core configurations
│   │   │   ├── db/          # Database models and migrations
│   │   │   ├── schemas/     # Pydantic models
│   │   │   └── services/    # Business logic
│   │   ├── tests/           # Backend tests
│   │   └── requirements.txt  # Python dependencies
│   ├── frontend/            # React TypeScript frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Page components
│   │   │   ├── services/    # API services
│   │   │   └── types/       # TypeScript types
│   │   ├── public/          # Static files
│   │   └── package.json     # Node dependencies
│   └── docker/              # Docker configuration files
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       └── docker-compose.yml

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Frontend**: React + TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Form Handling**: Formik + Yup
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## Setup Instructions

### Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed:
   ```bash
   docker --version
   docker-compose --version
   ```

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bookstore
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. To stop the application:
   ```bash
   docker-compose down
   ```

### Manual Setup (Alternative)

### Prerequisites

1. Python 3.11 or lower (Python 3.13 is not yet supported by all dependencies)
   - **Important Note**: Currently, some key dependencies (`psycopg2-binary` and `pydantic-core`) are not compatible with Python 3.13
   - If you have Python 3.13 installed, we recommend creating a virtual environment with Python 3.11:
     ```bash
     # Install Python 3.11 (if not already installed)
     brew install python@3.11

     # Create virtual environment with Python 3.11
     python3.11 -m venv venv
     source venv/bin/activate
     ```

2. Node.js 18.x or higher and npm 9.x or higher:
   ```bash
   # On macOS using Homebrew
   brew install node

   # Verify installation
   node --version
   npm --version
   ```

3. Install PostgreSQL (if not already installed):
   ```bash
   # On macOS using Homebrew
   brew install postgresql@15
   brew services start postgresql@15

   # Add PostgreSQL to your PATH (add this to your ~/.zshrc or ~/.bashrc)
   echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. Required global npm packages (optional but recommended):
   ```bash
   # Install TypeScript globally
   npm install -g typescript

   # Install React Developer Tools for your browser
   # Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
   # Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
   ```

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bookstore
   ```

2. Set up the backend:
   ```bash
   cd backend
   # Create and activate virtual environment
   python3.11 -m venv venv  # Make sure to use Python 3.11
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Start the development servers:
   ```bash
   # Backend
   cd backend
   uvicorn app.main:app --reload

   # Frontend
   cd frontend
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Features

- User authentication and authorization
- Book catalog with search and filtering
- Shopping cart functionality with real-time updates
- Order processing and management
- Responsive Material-UI design
- Form validation with Formik and Yup
- State management with Redux Toolkit
- Category-based book browsing
- RESTful API endpoints with TypeScript integration
- Error handling and loading states
- Modern and intuitive user interface

## Known Issues

### Python 3.13 Compatibility

The project currently has compatibility issues with Python 3.13 due to the following dependencies:
- `psycopg2-binary`: Build fails due to compiler errors
- `pydantic-core`: Build fails due to missing argument in ForwardRef._evaluate()

**Solution**: Use Python 3.11 as recommended in the Prerequisites section. We will update the project once these dependencies release versions compatible with Python 3.13.
```
````
