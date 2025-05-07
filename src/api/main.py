from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .bookApi import router as book_router

app = FastAPI(title="Bookstore API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(book_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Bookstore API"} 