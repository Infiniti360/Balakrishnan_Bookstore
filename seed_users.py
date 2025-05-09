import sqlite3
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# Connect to the database
conn = sqlite3.connect('backend/bookstore.db')
cursor = conn.cursor()

# Check if users table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user_credentials'")
if not cursor.fetchone():
    print("Creating user_credentials table...")
    cursor.execute('''
    CREATE TABLE user_credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
    ''')

# Add default users
default_users = [
    (1, "admin@bookstore.com", "admin", get_password_hash("admin123")),
    (2, "user@bookstore.com", "user", get_password_hash("user123"))
]

# Insert users
for user in default_users:
    try:
        cursor.execute(
            "INSERT OR REPLACE INTO user_credentials (id, email, username, password) VALUES (?, ?, ?, ?)",
            user
        )
        print(f"Added/updated user: {user[1]}")
    except sqlite3.IntegrityError as e:
        print(f"Error adding user {user[1]}: {e}")

# Commit changes and close
conn.commit()
conn.close()

print("User setup complete!") 