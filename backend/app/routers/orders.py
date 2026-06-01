from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.crud import order as crud

class StatusUpdate(BaseModel):
    status: str

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return crud.get_order(db, order_id)

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_status(order_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    return crud.update_order_status(db, order_id, body.status)

@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    crud.delete_order(db, order_id)
