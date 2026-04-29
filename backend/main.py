import logging

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.expenses import router as expenses_router
from app.config import HOST, PORT
from app.utils.database import initialize_database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="MyExpense API",
    description="Expense tracking API",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up MyExpense API")
    initialize_database()


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down MyExpense API")


# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "MyExpense API",
        "version": "1.0.0",
        "docs": "/docs"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Register API routes
app.include_router(expenses_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
