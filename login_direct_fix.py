import sqlite3
import bcrypt

# Connect to the database
conn = sqlite3.connect('backend/bookstore.db')
cursor = conn.cursor()

# Drop the existing user_credentials table to start fresh
cursor.execute("DROP TABLE IF EXISTS user_credentials")

# Create the user_credentials table
cursor.execute("""
CREATE TABLE user_credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)
""")

# Create a simple password hash
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Insert users with properly hashed passwords
admin_hash = hash_password("admin123")
user_hash = hash_password("user123")

cursor.execute("INSERT INTO user_credentials (email, username, password) VALUES (?, ?, ?)",
               ("admin@bookstore.com", "admin", admin_hash))
cursor.execute("INSERT INTO user_credentials (email, username, password) VALUES (?, ?, ?)",
               ("user@bookstore.com", "user", user_hash))

# Print the admin password hash for debugging
print(f"Admin password hash: {admin_hash}")

# Commit and close
conn.commit()
conn.close()

print("User credentials table recreated with fresh authentication data.") 