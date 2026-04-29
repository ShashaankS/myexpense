import logging
from typing import Optional
from datetime import datetime
from decimal import Decimal
from uuid import uuid4

from app.utils.database import get_supabase_client
from app.utils.helpers import generate_idempotency_key
from app.schemas.expense import ExpenseCreate, ExpenseResponse

logger = logging.getLogger(__name__)


class ExpenseService:
    """Service layer for expense operations"""

    @staticmethod
    def ensure_user_profile(user_id: str) -> None:
        """Ensure a profile exists for the authenticated user."""
        client = get_supabase_client()
        now = datetime.utcnow().isoformat()
        try:
            client.table("profiles").upsert(
                {
                    "user_id": user_id,
                    "created_at": now,
                    "updated_at": now,
                }
            ).execute()
        except Exception as e:
            logger.warning(f"Error ensuring user profile exists: {e}")

    @staticmethod
    def create_expense(expense_data: ExpenseCreate, user_id: str) -> ExpenseResponse:
        """
        Create a new expense with idempotency support.
        If the same expense is created twice (idempotency key match),
        the original is returned instead of duplicating.
        
        Args:
            expense_data: Expense creation data
            user_id: UUID of the authenticated user
        """
        client = get_supabase_client()
        ExpenseService.ensure_user_profile(user_id)
        
        # Generate or use provided idempotency key
        idempotency_key = expense_data.idempotency_key
        if not idempotency_key:
            idempotency_key = generate_idempotency_key(
                expense_data.amount,
                expense_data.category,
                expense_data.description,
                expense_data.date
            )
        
        # Check if expense with same idempotency key exists (for this user)
        try:
            existing = client.table("expenses").select("*").eq(
                "idempotency_key", idempotency_key
            ).eq("user_id", user_id).execute()
            
            if existing.data and len(existing.data) > 0:
                logger.info(f"Idempotent request: returning existing expense {existing.data[0]['id']}")
                return ExpenseResponse(**existing.data[0])
        except Exception as e:
            logger.warning(f"Error checking for existing expense: {e}")
        
        # Create new expense
        expense_id = str(uuid4())
        now = datetime.utcnow().isoformat()
        
        expense_payload = {
            "id": expense_id,
            "user_id": user_id,
            "amount": str(expense_data.amount),  # Store as string to preserve precision
            "category": expense_data.category,
            "description": expense_data.description,
            "date": expense_data.date.isoformat(),
            "idempotency_key": idempotency_key,
            "created_at": now,
            "updated_at": now,
        }
        
        try:
            result = client.table("expenses").insert(expense_payload).execute()
            logger.info(f"Created expense {expense_id} for user {user_id}")
            
            # Convert amount back to Decimal for response
            response_data = result.data[0]
            response_data["amount"] = Decimal(response_data["amount"])
            response_data["created_at"] = datetime.fromisoformat(response_data["created_at"])
            response_data["updated_at"] = datetime.fromisoformat(response_data["updated_at"])
            
            return ExpenseResponse(**response_data)
        except Exception as e:
            logger.error(f"Error creating expense: {e}")
            raise

    @staticmethod
    def get_expenses(
        user_id: str,
        category: Optional[str] = None,
        sort: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> tuple[list[ExpenseResponse], int]:
        """
        Retrieve expenses for a user with optional filtering and sorting.
        
        Args:
            user_id: UUID of the authenticated user
            category: Filter by category
            sort: Sort parameter (e.g., 'date_desc', 'amount_asc')
            limit: Number of records to return
            offset: Pagination offset
            
        Returns:
            Tuple of (expenses list, total count)
        """
        client = get_supabase_client()
        
        try:
            # Build query filtered by user_id
            query = client.table("expenses").select("*").eq("user_id", user_id)
            
            # Apply category filter
            if category:
                query = query.eq("category", category)
            
            # Get total count
            count_result = query.execute()
            total = len(count_result.data)
            
            # Parse sort parameter
            from app.utils.helpers import parse_sort_param
            sort_column, sort_direction = parse_sort_param(sort)
            
            # Apply sorting and pagination
            query = client.table("expenses").select("*").eq("user_id", user_id)
            if category:
                query = query.eq("category", category)
            
            # Sort
            is_ascending = sort_direction == "asc"
            query = query.order(sort_column, desc=not is_ascending)
            
            # Paginate
            result = query.range(offset, offset + limit - 1).execute()
            
            # Convert results
            expenses = []
            for exp in result.data:
                exp["amount"] = Decimal(exp["amount"])
                exp["created_at"] = datetime.fromisoformat(exp["created_at"])
                if exp.get("updated_at"):
                    exp["updated_at"] = datetime.fromisoformat(exp["updated_at"])
                expenses.append(ExpenseResponse(**exp))
            
            logger.info(f"Retrieved {len(expenses)} expenses for user {user_id} (total: {total})")
            return expenses, total
            
        except Exception as e:
            logger.error(f"Error retrieving expenses: {e}")
            raise

    @staticmethod
    def get_expense_by_id(expense_id: str, user_id: str) -> Optional[ExpenseResponse]:
        """Get a single expense by ID (filtered by user)"""
        client = get_supabase_client()
        
        try:
            result = client.table("expenses").select("*").eq("id", expense_id).eq("user_id", user_id).execute()
            
            if result.data and len(result.data) > 0:
                exp = result.data[0]
                exp["amount"] = Decimal(exp["amount"])
                exp["created_at"] = datetime.fromisoformat(exp["created_at"])
                if exp.get("updated_at"):
                    exp["updated_at"] = datetime.fromisoformat(exp["updated_at"])
                return ExpenseResponse(**exp)
            
            return None
        except Exception as e:
            logger.error(f"Error retrieving expense {expense_id}: {e}")
            raise

    @staticmethod
    def delete_expense(expense_id: str, user_id: str) -> bool:
        """Delete an expense by ID (filtered by user)"""
        client = get_supabase_client()
        
        try:
            client.table("expenses").delete().eq("id", expense_id).eq("user_id", user_id).execute()
            logger.info(f"Deleted expense {expense_id} for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting expense {expense_id}: {e}")
            raise
