import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables are required")

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
