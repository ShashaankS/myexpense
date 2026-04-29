from fastapi import APIRouter, HTTPException, Query, Header
from typing import Optional
import logging

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseListResponse,
)
from app.services.expense import ExpenseService
from app.utils.auth import get_user_id_from_request

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseResponse, status_code=201)
async def create_expense(
    expense: ExpenseCreate,
    authorization: Optional[str] = Header(None)
) -> ExpenseResponse:
    """
    Create a new expense.
    
    The API is idempotent - if the same request is sent multiple times with the same
    idempotency_key, it will return the same expense instead of creating duplicates.
    
    Request body:
    - amount: Decimal (must be > 0)
    - category: str (expense category)
    - description: str (expense description)
    - date: datetime (date of the expense)
    - idempotency_key: Optional[str] (for retry safety)
    
    Headers:
    - Authorization: Bearer <JWT token>
    """
    try:
        user_id = get_user_id_from_request(authorization)
        result = ExpenseService.create_expense(expense, user_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating expense: {e}")
        raise HTTPException(status_code=500, detail="Failed to create expense")


@router.get("", response_model=ExpenseListResponse)
async def list_expenses(
    category: Optional[str] = Query(None, description="Filter by category"),
    sort: Optional[str] = Query(None, description="Sort by: date_desc (default), date_asc, amount_desc, amount_asc"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    authorization: Optional[str] = Header(None)
) -> ExpenseListResponse:
    """
    Retrieve a list of expenses for the authenticated user with optional filtering and sorting.
    
    Query parameters:
    - category: Filter by category (optional)
    - sort: Sort parameter - date_desc (default), date_asc, amount_desc, amount_asc (optional)
    - limit: Number of records (default: 100, max: 1000)
    - offset: Pagination offset (default: 0)
    
    Headers:
    - Authorization: Bearer <JWT token>
    """
    try:
        user_id = get_user_id_from_request(authorization)
        expenses, total = ExpenseService.get_expenses(
            user_id=user_id,
            category=category,
            sort=sort,
            limit=limit,
            offset=offset
        )
        return ExpenseListResponse(expenses=expenses, total=total)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing expenses: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve expenses")


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: str,
    authorization: Optional[str] = Header(None)
) -> ExpenseResponse:
    """Get a specific expense by ID"""
    try:
        user_id = get_user_id_from_request(authorization)
        expense = ExpenseService.get_expense_by_id(expense_id, user_id)
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        return expense
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving expense {expense_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve expense")


@router.delete("/{expense_id}", status_code=204)
async def delete_expense(
    expense_id: str,
    authorization: Optional[str] = Header(None)
) -> None:
    """Delete an expense by ID"""
    try:
        user_id = get_user_id_from_request(authorization)
        
        # Check if expense exists first
        expense = ExpenseService.get_expense_by_id(expense_id, user_id)
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        ExpenseService.delete_expense(expense_id, user_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting expense {expense_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete expense")
