import jwt
import logging
from typing import Optional
from fastapi import HTTPException

logger = logging.getLogger(__name__)


def extract_user_id_from_token(token: str) -> str:
    """
    Extract user_id from Supabase JWT token.
    
    Supabase stores the user ID in the 'sub' (subject) claim of the JWT.
    
    Args:
        token: JWT token string (without 'Bearer ' prefix)
        
    Returns:
        User ID (UUID string)
        
    Raises:
        HTTPException: If token is invalid or missing user_id
    """
    try:
        # Decode without verification since we're trusting Supabase's token
        # The verification is done by Supabase Auth service
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        user_id = decoded.get("sub")
        if not user_id:
            logger.warning("Token decoded but 'sub' claim missing")
            raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
        
        logger.debug(f"Extracted user_id from token: {user_id}")
        return user_id
        
    except jwt.DecodeError as e:
        logger.error(f"Failed to decode JWT token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error extracting user_id from token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


def get_user_id_from_request(authorization_header: Optional[str]) -> str:
    """
    Extract user_id from Authorization header.
    
    Expected format: "Bearer <token>"
    
    Args:
        authorization_header: Authorization header value
        
    Returns:
        User ID (UUID string)
        
    Raises:
        HTTPException: If header is missing or invalid
    """
    if not authorization_header:
        logger.warning("Authorization header missing")
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    parts = authorization_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        logger.warning("Invalid authorization header format")
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    token = parts[1]
    return extract_user_id_from_token(token)
