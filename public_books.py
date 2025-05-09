from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import List
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define models
class Book(BaseModel):
    id: int
    name: str
    author: str
    published_year: int
    book_summary: str

# Function to get database connection
def get_db():
    conn = sqlite3.connect('backend/bookstore.db')
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to BookStore Public API"}

@app.get("/books", response_model=List[Book])
def get_books(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books")
    books = [dict(row) for row in cursor.fetchall()]
    return books

@app.get("/books/{book_id}", response_model=Book)
def get_book(book_id: int, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books WHERE id = ?", (book_id,))
    book = dict(cursor.fetchone())
    return book

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5002)