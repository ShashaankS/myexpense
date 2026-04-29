import logging
from typing import Optional
from datetime import datetime
from decimal import Decimal

logger = logging.getLogger(__name__)


def format_decimal_to_string(value: Decimal) -> str:
    """Convert Decimal to string for JSON serialization"""
    return str(value)


def parse_sort_param(sort_param: Optional[str]) -> tuple[str, str]:
    """
    Parse sort parameter and return (column, direction).
    Supports: 'date_desc', 'date_asc', 'amount_desc', 'amount_asc'
    Defaults to 'created_at' descending.
    """
    if not sort_param:
        return "created_at", "desc"
    
    valid_sorts = {
        "date_desc": ("date", "desc"),
        "date_asc": ("date", "asc"),
        "amount_desc": ("amount", "desc"),
        "amount_asc": ("amount", "asc"),
        "created_desc": ("created_at", "desc"),
        "created_asc": ("created_at", "asc"),
    }
    
    return valid_sorts.get(sort_param, ("created_at", "desc"))


def generate_idempotency_key(
    amount: Decimal,
    category: str,
    description: str,
    date: datetime
) -> str:
    """Generate a deterministic idempotency key from expense data"""
    import hashlib
    
    data = f"{amount}|{category}|{description}|{date.isoformat()}"
    return hashlib.sha256(data.encode()).hexdigest()
