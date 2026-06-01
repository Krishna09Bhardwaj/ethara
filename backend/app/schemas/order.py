from datetime import datetime
from pydantic import BaseModel, field_validator

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be > 0")
        return v

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product_name: str | None = None

    model_config = {"from_attributes": True}

class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    customer_name: str | None = None
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}
