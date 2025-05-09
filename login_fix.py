from passlib.context import CryptContext
import sqlite3
import bcrypt

# Set up the same password context as in the backend
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    """Generate password hash using the same method as the backend"""
    return pwd_context.hash(password)

# Connect to the database
conn = sqlite3.connect('backend/bookstore.db')
cursor = conn.cursor()

# Reset the user credentials with properly hashed passwords
admin_password = "admin123"
user_password = "user123"

admin_hash = get_password_hash(admin_password)
user_hash = get_password_hash(user_password)

print(f"Admin password hash: {admin_hash}")
print(f"User password hash: {user_hash}")

# Update the users with the properly hashed passwords
cursor.execute("UPDATE user_credentials SET password = ? WHERE email = ?", 
               (admin_hash, "admin@bookstore.com"))
cursor.execute("UPDATE user_credentials SET password = ? WHERE email = ?", 
               (user_hash, "user@bookstore.com"))

# Verify the changes
cursor.execute("SELECT id, email, username FROM user_credentials")
users = cursor.fetchall()
print("\nUsers in database:")
for user in users:
    print(f"ID: {user[0]}, Email: {user[1]}, Username: {user[2]}")

# Commit and close
conn.commit()
conn.close()

print("\nUser credentials updated with compatible password hashing.") 