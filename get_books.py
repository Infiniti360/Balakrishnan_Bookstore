import sqlite3
import json

# Connect to the database
conn = sqlite3.connect('backend/bookstore.db')
conn.row_factory = sqlite3.Row  # This enables column access by name
cursor = conn.cursor()

# Get all books
cursor.execute("SELECT * FROM books")
books = [dict(row) for row in cursor.fetchall()]

# Print books as JSON
print(json.dumps(books, indent=2))

# Close connection
conn.close() 