import sqlite3

# Connect to the database
conn = sqlite3.connect('backend/bookstore.db')
cursor = conn.cursor()

# Check current books
cursor.execute("SELECT id, name FROM books")
existing_books = cursor.fetchall()
print("Existing books:")
for book in existing_books:
    print(f"{book[0]}: {book[1]}")

# Add additional books if they don't exist yet
new_books = [
    (8, "Harry Potter and the Philosopher's Stone", "J.K. Rowling", 1997, "The first novel in the Harry Potter series, following the life of a young wizard, Harry Potter, and his friends at Hogwarts School of Witchcraft and Wizardry."),
    (9, "The Chronicles of Narnia", "C.S. Lewis", 1950, "A series of fantasy novels set in the fictional realm of Narnia, a world where magic exists, animals talk, and good battles evil."),
    (10, "Brave New World", "Aldous Huxley", 1932, "A dystopian novel set in a futuristic World State, whose citizens are environmentally engineered into an intelligence-based social hierarchy."),
    (11, "The Alchemist", "Paulo Coelho", 1988, "A philosophical novel about a young Andalusian shepherd who dreams of finding a worldly treasure and embarks on a journey to find it."),
    (12, "Moby-Dick", "Herman Melville", 1851, "The story of sailor Ishmael and his voyage on the whaleship Pequod, commanded by Captain Ahab who seeks revenge on the white whale Moby Dick.")
]

# Insert new books
for book in new_books:
    try:
        cursor.execute(
            "INSERT INTO books (id, name, author, published_year, book_summary) VALUES (?, ?, ?, ?, ?)",
            book
        )
        print(f"Added book: {book[1]}")
    except sqlite3.IntegrityError:
        print(f"Book ID {book[0]} already exists, skipping")

# Commit changes and close
conn.commit()
conn.close()

print("Database update complete!") 