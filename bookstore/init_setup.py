import os
import subprocess
import time
from database import init_db, SessionLocal, UserCredentials
from utils import get_password_hash

def init_database():
    """Initialize the database and create tables"""
    print("Initializing database...")
    init_db()
    print("Database initialized successfully!")

def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("Creating admin user...")
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "test@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "password123")
        
        # Check if admin user exists
        admin = db.query(UserCredentials).filter(UserCredentials.email == admin_email).first()
        if not admin:
            hashed_password = get_password_hash(admin_password)
            admin = UserCredentials(
                email=admin_email,
                password=hashed_password
            )
            db.add(admin)
            db.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")
    finally:
        db.close()

def start_api_server():
    """Start the FastAPI server"""
    print("Starting API server...")
    api_process = subprocess.Popen(["uvicorn", "main:app", "--reload", "--port", "8000"])
    time.sleep(5)  # Wait for server to start
    return api_process

def add_sample_data():
    """Add sample books to the database"""
    print("Adding sample books...")
    subprocess.run(["python3", "add_sample_books.py"])

def main():
    try:
        # Initialize database
        init_database()
        
        # Create admin user
        create_admin_user()
        
        # Start API server
        api_process = start_api_server()
        
        # Add sample books
        add_sample_data()
        
        print("\nSetup completed successfully!")
        print("API server is running at http://localhost:8000")
        print("You can now start the mobile app.")
        
        # Keep the server running
        api_process.wait()
        
    except Exception as e:
        print(f"Error during setup: {e}")
        raise

if __name__ == "__main__":
    main() 