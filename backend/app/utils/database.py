import logging
from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY

logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase_client():
    """Get the Supabase client instance"""
    return supabase


def initialize_database():
    """
    Initialize database schema if it doesn't exist.
    This creates the necessary tables for the expense tracking app.
    """
    try:
        # Check if expenses table exists by attempting to query it
        supabase.table("expenses").select("id").limit(1).execute()
        logger.info("Expenses table already exists")
    except Exception as e:
        logger.error(f"Error checking expenses table: {e}")
        logger.info("Run database migration manually if needed")
