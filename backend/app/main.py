import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import init_db
from .routes import router
from .seed import seed_data

# Load environment variables
load_dotenv()

# Initialize app
app = FastAPI(title="BookStore API")

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
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

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend server is running"}

if __name__ == "__main__":
    import uvicorn
    port = 5001  # Fixed port to match mobile app configuration
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        access_log=True,
        log_level="debug"
    ) 