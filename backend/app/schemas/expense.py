from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field
from typing import Optional


class ExpenseBase(BaseModel):
    """Base expense model with common fields"""
    amount: Decimal = Field(..., gt=0, description="Expense amount in currency")
    category: str = Field(..., min_length=1, max_length=50, description="Expense category")
    description: str = Field(..., min_length=1, max_length=500, description="Expense description")
    date: datetime = Field(..., description="Date of the expense")


class ExpenseCreate(ExpenseBase):
    """Request schema for creating an expense"""
    idempotency_key: Optional[str] = Field(
        None,
        description="Optional idempotency key for request retry safety"
    )


class ExpenseUpdate(BaseModel):
    """Request schema for updating an expense"""
    amount: Optional[Decimal] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    date: Optional[datetime] = None


class ExpenseResponse(ExpenseBase):
    """Response schema for an expense"""
    id: str = Field(..., description="Unique expense ID")
    created_at: datetime = Field(..., description="When the expense was created")
    updated_at: Optional[datetime] = Field(None, description="When the expense was last updated")

    class Config:
        from_attributes = True


class ExpenseListResponse(BaseModel):
    """Response schema for expense list"""
    expenses: list[ExpenseResponse]
    total: int = Field(..., description="Total number of expenses")
