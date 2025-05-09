import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = 5001  # Fixed port to match mobile app configuration
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) 