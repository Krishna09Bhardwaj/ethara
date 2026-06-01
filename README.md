# Ethara — Inventory & Order Management System

A production-ready full-stack web application for managing products, customers, and orders. Built with FastAPI, React, PostgreSQL, and Docker.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Python 3.11, FastAPI, SQLAlchemy 2, Alembic     |
| Database   | PostgreSQL 15                                   |
| Frontend   | React 18, Vite, TailwindCSS, React Router v6    |
| HTTP Client| Axios                                           |
| Container  | Docker, Docker Compose                          |

---

## Running with Docker Compose (Recommended)

### Prerequisites
- Docker Desktop installed and running

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Krishna09Bhardwaj/ethara.git
   cd ethara
   ```

2. **Set up environment variables:**
   ```bash
   # Root .env for Docker Compose database credentials
   cp .env.example .env

   # Backend .env
   cp backend/.env.example backend/.env

   # Frontend .env
   cp frontend/.env.example frontend/.env
   ```

3. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

5. **Stop the application:**
   ```bash
   docker compose down
   ```

---

## Running Locally Without Docker

### Backend

**Prerequisites:** Python 3.11+, PostgreSQL 15 running locally

1. **Set up virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env — set DATABASE_URL to your local PostgreSQL connection string
   # Example: DATABASE_URL=postgresql://postgres:password@localhost:5432/ethara_db
   ```

3. **Create the database:**
   ```bash
   psql -U postgres -c "CREATE DATABASE ethara_db;"
   ```

4. **Start the backend:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend

**Prerequisites:** Node.js 20+

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # VITE_API_URL=http://localhost:8000
   ```

3. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

   Frontend runs at [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

### Root `.env` (Docker Compose database)

| Variable           | Description                | Default       |
|--------------------|----------------------------|---------------|
| `POSTGRES_USER`    | PostgreSQL username         | `ethara_user` |
| `POSTGRES_PASSWORD`| PostgreSQL password         | `ethara_pass` |
| `POSTGRES_DB`      | PostgreSQL database name    | `ethara_db`   |

### `backend/.env`

| Variable        | Description                         | Default                                                |
|-----------------|-------------------------------------|--------------------------------------------------------|
| `DATABASE_URL`  | Full PostgreSQL connection string   | `postgresql://ethara_user:ethara_pass@db:5432/ethara_db` |
| `FRONTEND_URL`  | Allowed CORS origin                 | `http://localhost:5173`                                |

### `frontend/.env`

| Variable       | Description              | Default                   |
|----------------|--------------------------|---------------------------|
| `VITE_API_URL` | Backend API base URL     | `http://localhost:8000`   |

---

## API Endpoint Reference

### Health
| Method | Endpoint     | Description     |
|--------|--------------|-----------------|
| GET    | `/health`    | Health check    |
| GET    | `/dashboard` | Dashboard stats |

### Products
| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | `/products/`      | List all products |
| POST   | `/products/`      | Create product   |
| GET    | `/products/{id}`  | Get product      |
| PUT    | `/products/{id}`  | Update product   |
| DELETE | `/products/{id}`  | Delete product   |

### Customers
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | `/customers/`      | List all customers |
| POST   | `/customers/`      | Create customer   |
| GET    | `/customers/{id}`  | Get customer      |
| DELETE | `/customers/{id}`  | Delete customer   |

### Orders
| Method | Endpoint        | Description                      |
|--------|-----------------|----------------------------------|
| GET    | `/orders/`      | List all orders                  |
| POST   | `/orders/`      | Create order (checks stock)      |
| GET    | `/orders/{id}`  | Get order with items             |
| DELETE | `/orders/{id}`  | Cancel order (restores stock)    |

---

## Folder Structure

```
ethara/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py           # App entry point, CORS, routes
│   │   ├── database.py       # SQLAlchemy engine and session
│   │   ├── models/           # ORM models (Product, Customer, Order)
│   │   ├── schemas/          # Pydantic v2 request/response schemas
│   │   ├── routers/          # API route handlers
│   │   └── crud/             # Database operations
│   ├── alembic/              # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                 # React application
│   ├── src/
│   │   ├── api/axios.js      # Axios instance with base URL
│   │   ├── pages/            # Dashboard, Products, Customers, Orders
│   │   └── components/       # Navbar, forms, StatsCard
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Business Rules

1. **SKU uniqueness** — Duplicate SKUs return HTTP 400
2. **Email uniqueness** — Duplicate customer emails return HTTP 400
3. **Stock validation** — Orders check all items before deducting any stock (atomic)
4. **Stock restoration** — Cancelling an order restores product quantities
5. **Total calculation** — Order totals are always computed by the backend
6. **Negative quantities** — Not accepted anywhere in the system
