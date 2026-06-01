from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse

def _build_order_response(order: Order) -> OrderResponse:
    items = []
    for item in order.items:
        product_name = item.product.name if item.product else None
        items.append(OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            product_name=product_name,
        ))
    customer_name = order.customer.full_name if order.customer else None
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        total_amount=order.total_amount,
        status=order.status,
        created_at=order.created_at,
        customer_name=customer_name,
        items=items,
    )

def get_order(db: Session, order_id: int) -> OrderResponse:
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.customer),
        )
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _build_order_response(order)

def get_orders(db: Session) -> list[OrderResponse]:
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.customer),
        )
        .order_by(Order.created_at.desc())
        .all()
    )
    return [_build_order_response(o) for o in orders]

def create_order(db: Session, order_data: OrderCreate) -> OrderResponse:
    customer = db.query(Customer).filter(Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Validate stock for ALL items first (atomic check)
    products_map = {}
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.quantity}, requested: {item.quantity}"
            )
        products_map[item.product_id] = product

    # All checks passed — deduct stock and create order
    total_amount = 0.0
    order = Order(customer_id=order_data.customer_id, total_amount=0.0, status="pending")
    db.add(order)
    db.flush()  # get order.id without committing

    for item in order_data.items:
        product = products_map[item.product_id]
        unit_price = product.price
        product.quantity -= item.quantity
        total_amount += unit_price * item.quantity
        db.add(OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=unit_price,
        ))

    order.total_amount = round(total_amount, 2)
    db.commit()

    return get_order(db, order.id)

def update_order_status(db: Session, order_id: int, status: str) -> OrderResponse:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if status not in ("pending", "completed", "cancelled"):
        raise HTTPException(status_code=400, detail="Invalid status")
    order.status = status
    db.commit()
    return get_order(db, order_id)

def delete_order(db: Session, order_id: int) -> None:
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Restore stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()
