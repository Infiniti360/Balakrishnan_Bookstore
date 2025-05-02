from database import SessionLocal, UserCredentials
from utils import get_password_hash

def init_db():
    db = SessionLocal()
    
    # Create test user if it doesn't exist
    test_user = db.query(UserCredentials).filter(UserCredentials.email == "test@example.com").first()
    if not test_user:
        hashed_password = get_password_hash("password123")
        test_user = UserCredentials(
            email="test@example.com",
            password=hashed_password
        )
        db.add(test_user)
        db.commit()
        print("Test user created successfully")
    else:
        print("Test user already exists")

if __name__ == "__main__":
    init_db() 