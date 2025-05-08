import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import init_db
from .routes import router
from .seed import seed_data

# Load environment variables
load_dotenv()

# Initialize app
app = FastAPI(title="BookStore API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

# Initialize database and seed data on startup
@app.on_event("startup")
def on_startup():
    init_db()
    seed_data()

@app.get("/")
def read_root():
    return {"message": "Welcome to BookStore API"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) 