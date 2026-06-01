# Ethara — Project Tracking

## Status Overview

| Component   | Status      | Notes                                     |
|-------------|-------------|-------------------------------------------|
| Backend     | ✅ Complete  | FastAPI + SQLAlchemy + Alembic            |
| Frontend    | ✅ Complete  | React 18 + Vite + TailwindCSS             |
| Docker      | ✅ Complete  | docker-compose.yml with db/backend/frontend |
| README      | ✅ Complete  | Full setup instructions + API reference   |
| Git / GitHub| ✅ Complete  | Pushed to https://github.com/Krishna09Bhardwaj/ethara |

---

## Backend Files — Done

### Infrastructure
- [x] `backend/requirements.txt` — all pinned dependencies
- [x] `backend/Dockerfile` — python:3.11-slim, non-root user (appuser)
- [x] `backend/.dockerignore`
- [x] `backend/.env` — Docker Compose values
- [x] `backend/.env.example` — template for local setup
- [x] `backend/alembic.ini` — Alembic config
- [x] `backend/alembic/env.py` — reads DATABASE_URL from env, registers all models
- [x] `backend/alembic/script.py.mako` — migration template

### Application
- [x] `backend/app/__init__.py`
- [x] `backend/app/database.py` — SQLAlchemy engine, SessionLocal, Base, get_db
- [x] `backend/app/main.py` — FastAPI app, CORS middleware, routers, dashboard endpoint, /health

### Models (SQLAlchemy ORM)
- [x] `backend/app/models/__init__.py` — imports all models to register them
- [x] `backend/app/models/product.py` — Product (id, name, sku, price, quantity, created_at)
- [x] `backend/app/models/customer.py` — Customer (id, full_name, email, phone, created_at)
- [x] `backend/app/models/order.py` — Order + OrderItem (with relationships)

### Schemas (Pydantic v2)
- [x] `backend/app/schemas/__init__.py`
- [x] `backend/app/schemas/product.py` — ProductCreate, ProductUpdate, ProductResponse (validators: price ≥ 0, quantity ≥ 0)
- [x] `backend/app/schemas/customer.py` — CustomerCreate, CustomerResponse (EmailStr)
- [x] `backend/app/schemas/order.py` — OrderCreate, OrderItemCreate, OrderResponse, OrderItemResponse

### CRUD
- [x] `backend/app/crud/__init__.py`
- [x] `backend/app/crud/product.py` — get, list, create (SKU uniqueness), update, delete
- [x] `backend/app/crud/customer.py` — get, list, create (email uniqueness), delete
- [x] `backend/app/crud/order.py` — atomic stock check, deduct, create; restore on delete

### Routers
- [x] `backend/app/routers/__init__.py`
- [x] `backend/app/routers/products.py` — GET /, POST /, GET /{id}, PUT /{id}, DELETE /{id}
- [x] `backend/app/routers/customers.py` — GET /, POST /, GET /{id}, DELETE /{id}
- [x] `backend/app/routers/orders.py` — GET /, POST /, GET /{id}, DELETE /{id}

---

## Frontend Files — Done

### Config / Build
- [x] `frontend/package.json` — React 18, Vite, TailwindCSS, Axios, React Router v6
- [x] `frontend/vite.config.js`
- [x] `frontend/tailwind.config.js`
- [x] `frontend/postcss.config.js`
- [x] `frontend/index.html`
- [x] `frontend/.env` — VITE_API_URL=http://localhost:8000
- [x] `frontend/.env.example`
- [x] `frontend/Dockerfile` — multi-stage: node:20-alpine build → nginx:alpine serve
- [x] `frontend/nginx.conf` — SPA routing (try_files → index.html)
- [x] `frontend/.dockerignore`

### Application Entry
- [x] `frontend/src/main.jsx` — ReactDOM.createRoot, BrowserRouter
- [x] `frontend/src/index.css` — Tailwind directives
- [x] `frontend/src/App.jsx` — Routes: /, /products, /customers, /orders
- [x] `frontend/src/api/axios.js` — Axios instance with VITE_API_URL base URL

### Components
- [x] `frontend/src/components/Navbar.jsx` — active link highlighting
- [x] `frontend/src/components/StatsCard.jsx` — color-coded stat cards
- [x] `frontend/src/components/ProductForm.jsx` — add/edit form, client-side validation
- [x] `frontend/src/components/CustomerForm.jsx` — add form, email format validation
- [x] `frontend/src/components/OrderForm.jsx` — customer select, dynamic product/qty items

### Pages
- [x] `frontend/src/pages/Dashboard.jsx` — 4 stat cards + low stock table
- [x] `frontend/src/pages/Products.jsx` — table, add/edit modal, delete confirm, low-stock highlight
- [x] `frontend/src/pages/Customers.jsx` — table, add modal, delete confirm
- [x] `frontend/src/pages/Orders.jsx` — table, create modal, expandable row details, cancel

---

## Root Files — Done

- [x] `docker-compose.yml` — db (postgres:15), backend, frontend services with healthchecks
- [x] `.env.example` — POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- [x] `.gitignore` — .env, __pycache__, node_modules, .DS_Store, dist, *.pyc
- [x] `README.md` — full setup guide, API reference table, folder structure
- [x] `ethara.MD` — this file

---

## Business Rules Implemented

| Rule | Where enforced |
|------|---------------|
| Unique SKU | `crud/product.py` — 400 if duplicate |
| Unique email | `crud/customer.py` — 400 if duplicate |
| Stock check (atomic) | `crud/order.py` — all items validated before any deduction |
| Stock restoration | `crud/order.py` — `delete_order` restores quantity |
| Total calculated by backend | `crud/order.py` — sum(unit_price × qty) |
| Negative quantities blocked | Pydantic validators + form validation |
| 404 on missing resources | All CRUD functions raise HTTPException 404 |
| Non-root Docker container | Both Dockerfiles create and use `appuser` |
| CORS restricted | `main.py` — only FRONTEND_URL + localhost allowed |

---

## Security Checklist

- [x] No hardcoded secrets — all credentials in .env files
- [x] .env files in .gitignore
- [x] All inputs validated (Pydantic v2 on backend, form checks on frontend)
- [x] No raw SQL — SQLAlchemy ORM throughout
- [x] CORS not open to * in production (reads FRONTEND_URL from env)
- [x] Atomic stock check prevents partial deductions
- [x] Negative quantities rejected
- [x] 404 returned for missing resources (not 500)
- [x] Docker containers run as non-root (appuser)
- [x] No console.logs in production frontend code

---

## API Endpoints Summary

```
GET  /health
GET  /dashboard

GET    /products/
POST   /products/
GET    /products/{id}
PUT    /products/{id}
DELETE /products/{id}

GET    /customers/
POST   /customers/
GET    /customers/{id}
DELETE /customers/{id}

GET    /orders/
POST   /orders/
GET    /orders/{id}
DELETE /orders/{id}
```
