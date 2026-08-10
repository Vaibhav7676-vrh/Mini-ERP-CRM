# Mini ERP + CRM

A full-stack ERP and CRM operations portal built for wholesale and distribution workflows.

The application provides customer management, product management, inventory tracking, authentication, dashboard analytics, and sales challan management through a React frontend and RESTful Node.js backend.

---

## Features

### Authentication

- JWT-based authentication
- Secure password hashing using bcrypt/bcryptjs
- Protected application routes
- Role-based user structure
- Login and logout functionality
- Authentication token for protected API requests

### Customer CRM

- Add customers
- Edit customers
- Search customers
- View customer details
- Manage business information
- Manage contact information
- Manage GST information
- Manage customer type
- Manage follow-up information

### Product Management

- Add products
- Edit products
- Product name
- Product SKU/code
- Unit pricing
- Current stock
- Warehouse/location information

### Inventory

- View current product stock
- Track stock-related changes
- Validate stock availability
- Prevent invalid stock operations
- Automatically reduce stock after confirmed sales challans

### Sales Challans

- Create delivery challans
- Select customers
- Select products
- Enter product quantities
- Automatic challan number generation
- Product snapshot information
- Save challans as drafts
- Confirm challans
- Cancel challans
- Insufficient-stock validation
- Automatic inventory reduction after confirmation

### Dashboard

- Customer overview
- Product overview
- Inventory overview
- Challan overview
- Business activity summary

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- React Router
- Axios

### Backend

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- JWT
- bcrypt/bcryptjs

### Database

- MySQL

### Deployment

- Vercel - Frontend
- Render - Backend

---

## Architecture

```text
                 ┌─────────────────────┐
                 │    React Frontend   │
                 │  TypeScript + Vite  │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Express Backend   │
                 │   Node + TypeScript │
                 └──────────┬──────────┘
                            │
                         Prisma
                            │
                            ▼
                 ┌─────────────────────┐
                 │        MySQL        │
                 └─────────────────────┘


Project Structure
mini-erp-crm/
│
├── backend/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── .env
│
└── README.md




Live Demo

Frontend:

https://mini-erp-crm-one-rouge.vercel.app

Backend:

https://mini-erp-crm-backend-5rg9.onrender.com

API Base URL:

https://mini-erp-crm-backend-5rg9.onrender.com/api

Note: The deployed backend currently has a cloud database connectivity limitation. The complete application workflow can be demonstrated using the local MySQL setup.



Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
MySQL
Git
Clone the Repository
git clone https://github.com/Vaibhav7676-vrh/Mini-ERP-CRM.git
cd Mini-ERP-CRM


Backend Setup

Navigate to the backend:

cd backend

Install dependencies:

npm install

Generate Prisma Client:

npx prisma generate

Create a .env file inside the backend directory:

DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"
JWT_SECRET="your-secret-key"
PORT=5001

Run database migrations:

npx prisma migrate dev

Start the backend:

npm run dev




Frontend Setup

Create a .env file inside the frontend directory:

VITE_API_URL=http://localhost:5001/api

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will normally be available at:

http://localhost:5173

For a production build:

npm run build


Environment Variables
Backend

Create:

backend/.env

Required variables:

DATABASE_URL=
JWT_SECRET=
PORT=5001
Variable	    Description
DATABASE_URL	MySQL database connection string
JWT_SECRET	    Secret used for signing JWT tokens
PORT	        Backend server port

Frontend

Create:

frontend/.env

Required variable:

VITE_API_URL=http://localhost:5001/api




Authentication Flow
User
 │
 │ Login
 ▼
POST /api/auth/login
 │
 ▼
Backend validates credentials
 │
 ▼
Password verification
 │
 ▼
JWT token generated
 │
 ▼
Frontend stores authentication state
 │
 ▼
Token sent with protected API requests



Customer CRM

Supported operations include:

Add customer
Edit customer
Search customers
View customer details
Manage business information
Manage contact information
Manage GST information
Manage customer type
Manage follow-up information
Product Management

The product module manages products and their inventory information.

Each product can contain information such as:

Product name
SKU/code
Unit price
Current stock
Warehouse/location

Supported operations include:

Add product
Edit product
View products
Update product information


Inventory Management
Product Stock
     │
     ▼
Challan Created
     │
     ▼
Stock Validation
     │
     ├── Insufficient Stock ──► Operation Rejected
     │
     └── Sufficient Stock
              │
              ▼
         Challan Confirmed
              │
              ▼
         Stock Reduced




Sales Challan Workflow
             ┌─────────────┐
             │    DRAFT    │
             └──────┬──────┘
                    / \
                   /   \
                  ▼     ▼
        ┌─────────────┐ ┌─────────────┐
        │  CONFIRMED  │ │  CANCELLED  │
        └──────┬──────┘ └─────────────┘
               │
               ▼
          Stock Reduced




REST API Endpoints
Base URL

Local:

http://localhost:5001/api

Production:

https://mini-erp-crm-backend-5rg9.onrender.com/api
Authentication
Login
POST /api/auth/login
Customers
Get all customers
GET /api/customers
Create customer
POST /api/customers
Get customer by ID
GET /api/customers/:id
Update customer
PUT /api/customers/:id
Products
Get all products
GET /api/products
Create product
POST /api/products
Update product
PUT /api/products/:id
Inventory
Get inventory
GET /api/inventory

Inventory operations are connected with stock validation and sales challan confirmation.

Challans
Get all challans
GET /api/challans
Create challan
POST /api/challans
Confirm challan
PUT /api/challans/:id/confirm
Cancel challan
PUT /api/challans/:id/cancel



API Flow
Authentication:
POST /api/auth/login

Customers:
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id

Products:
GET    /api/products
POST   /api/products
PUT    /api/products/:id

Inventory:
GET    /api/inventory

Challans:
GET    /api/challans
POST   /api/challans
PUT    /api/challans/:id/confirm
PUT    /api/challans/:id/cancel



Deployment
Frontend

Platform:

Vercel

Live URL:

https://mini-erp-crm-one-rouge.vercel.app

Framework:

React + TypeScript + Vite

Production Environment Variable:

VITE_API_URL=https://mini-erp-crm-backend-5rg9.onrender.com/api
Backend

Platform:

Render

Live URL:

https://mini-erp-crm-backend-5rg9.onrender.com

Framework:

Node.js + TypeScript + Express.js



Production database connection is provided through:
DATABASE_URL=<production-mysql-connection-string>

Deployment Architecture
User
 │
 ▼
Vercel

React + TypeScript + Vite
 │
 │ HTTPS / REST API
 ▼
Render

Node.js + Express + TypeScript
 │
 │ Prisma ORM
 ▼
MySQL Database


Vercel Deployment
Import the GitHub repository into Vercel.
Set the frontend root directory:


frontend/
Install dependencies:
npm install
Build the frontend:
npm run build
Add the environment variable:


VITE_API_URL=https://mini-erp-crm-backend-5rg9.onrender.com/api
Deploy the application.

The frontend uses VITE_API_URL to communicate with the deployed backend.

Render Deployment
Create a new Web Service on Render.
Connect the GitHub repository.
Set the backend root directory:


backend/
Install dependencies:
npm install


Build the backend if required:
npm run build
Start the backend:
npm start


Configure the following environment variables:
DATABASE_URL=<production-mysql-connection-string>
JWT_SECRET=<production-jwt-secret>
PORT=<provided-by-render>

Deploy the backend.
Render provides the PORT environment variable automatically.

Prisma

After installing backend dependencies, generate Prisma Client:
npx prisma generate

For local development migrations:
npx prisma migrate dev

For production migrations:
npx prisma migrate deploy


Frontend
VITE_API_URL=https://mini-erp-crm-backend-5rg9.onrender.com/api


Backend
DATABASE_URL=<production-mysql-connection-string>
JWT_SECRET=<production-jwt-secret>
PORT=<provided-by-render>



Live Services

Frontend:
https://mini-erp-crm-one-rouge.vercel.app

Backend:
https://mini-erp-crm-backend-5rg9.onrender.com

API Base URL:
https://mini-erp-crm-backend-5rg9.onrender.com/api