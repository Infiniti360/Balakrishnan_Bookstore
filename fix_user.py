import sqlite3
import bcrypt

# Connect to the database
conn = sqlite3.connect('backend/bookstore.db')
cursor = conn.cursor()

# Create a simple password hash
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Update users with new password hash
cursor.execute("UPDATE user_credentials SET password = ? WHERE email = ?", 
               (hash_password("admin123"), "admin@bookstore.com"))
cursor.execute("UPDATE user_credentials SET password = ? WHERE email = ?", 
               (hash_password("user123"), "user@bookstore.com"))

# Verify the changes
cursor.execute("SELECT email, username FROM user_credentials")
users = cursor.fetchall()
print("Updated users:")
for user in users:
    print(f"Email: {user[0]}, Username: {user[1]}")

# Commit changes and close
conn.commit()
conn.close()

print("User credentials updated successfully!") 